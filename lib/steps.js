const fs = require('fs');
const {
    Connection,
    PublicKey,
    Transaction,
    StakeProgram,
    SystemProgram,
    LAMPORTS_PER_SOL
} = require('@solana/web3.js');
const { prompt, debug, info, success, warn, error } = require('./utils');
const { decryptKeystore, createSigner } = require('./crypto');
const { sendAndConfirmTransaction } = require('./transaction');
const { validateFileExists, collectStakeAccountsInteractive, loadStakeAccounts, confirmAction } = require('./input');
const {
    DEFAULT_KEYPAIR_OUTPUT,
    DEFAULT_COMMITMENT,
    DEFAULT_TRANSACTION_FEE
} = require('./constants');

/**
 * Validates input files
 */
async function validateInputFiles(config) {
    info('━━━ Step 1: File Input ━━━\n');

    const keystorePath = await config.getKeystorePath();
    const password = await config.getPassword();

    debug(`Using keystore: ${keystorePath}`);
    validateFileExists(keystorePath, 'Keystore');

    success('✓ Files validated\n');
    return { keystorePath, password };
}

/**
 * Decrypts keystore and creates signer
 */
function decryptAndCreateSigner(keystorePath, password) {
    info('━━━ Step 2: Decrypting Keystore ━━━\n');

    const result = decryptKeystore(keystorePath, password);
    const keypairBytes = result.keypairBytes;
    const publicKey = result.publicKey;

    success('✓ Keystore decrypted successfully!');
    success('✓ Public Key:', publicKey);

    // Save to wallet-keypair.json
    fs.writeFileSync(DEFAULT_KEYPAIR_OUTPUT, JSON.stringify(Array.from(keypairBytes)));
    success(`✓ Keypair saved to ${DEFAULT_KEYPAIR_OUTPUT}\n`);
    debug('Keypair saved with', keypairBytes.length, 'bytes');

    const signer = createSigner(Uint8Array.from(keypairBytes));
    debug('Signer created with public key:', signer.publicKey.toString());

    // Verify the signer has the correct public key
    if (signer.publicKey.toString() !== publicKey) {
        throw new Error(`Signer public key mismatch! Expected ${publicKey}, got ${signer.publicKey.toString()}`);
    }

    success('✓ Signer verified\n');
    return { signer, publicKey };
}

/**
 * Connects to Solana RPC
 */
async function connectToSolana(config) {
    info('━━━ Step 3: Connecting to Solana ━━━\n');

    const rpcUrl = await config.getRpcUrl();
    const connection = new Connection(rpcUrl, DEFAULT_COMMITMENT);

    success('✓ Connected to Solana\n');
    debug('Using RPC:', rpcUrl);
    debug('Commitment level:', DEFAULT_COMMITMENT);

    return connection;
}

/**
 * Checks and displays wallet balance
 */
async function checkBalance(connection, signer) {
    info('━━━ Step 4: Checking Balances ━━━\n');

    const walletBalance = await connection.getBalance(signer.publicKey);
    info('Wallet Balance:', walletBalance / LAMPORTS_PER_SOL, 'SOL');
    info('Wallet Address:', signer.publicKey.toString());
    debug('Wallet balance in lamports:', walletBalance);

    return walletBalance;
}

/**
 * Collects stake accounts
 */
async function collectStakeAccounts(connection, config) {
    info('━━━ Step 5: Staking Accounts ━━━\n');

    const stakeAccountAddresses = await config.getStakeAccounts();

    // If addresses provided via CLI, load them
    if (stakeAccountAddresses && stakeAccountAddresses.length > 0) {
        return await loadStakeAccounts(connection, stakeAccountAddresses);
    }

    // If in interactive mode, collect interactively
    if (config.isInteractive) {
        return await collectStakeAccountsInteractive(connection);
    }

    // Non-interactive with no stake accounts specified
    return [];
}

/**
 * Displays total balances
 */
function displayTotalBalances(walletBalance, stakeAccounts) {
    const totalStakeBalance = stakeAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalBalance = walletBalance + totalStakeBalance;

    info('\n━━━ Total Balances ━━━');
    info('  Wallet:', walletBalance / LAMPORTS_PER_SOL, 'SOL');
    info('  Stake Accounts:', totalStakeBalance / LAMPORTS_PER_SOL, 'SOL');
    info('  Total:', totalBalance / LAMPORTS_PER_SOL, 'SOL\n');
}

/**
 * Determines withdrawal destination
 */
async function getWithdrawDestination(config, signer) {
    const destination = config.getWithdrawDestination();
    if (destination) {
        return new PublicKey(destination);
    }

    if (config.isInteractive) {
        const withdrawTo = await prompt(`Enter destination address (press Enter to withdraw to current wallet ${signer.publicKey.toString().slice(0, 8)}...): `);
        return withdrawTo.trim() ? new PublicKey(withdrawTo.trim()) : signer.publicKey;
    }

    return signer.publicKey;
}

/**
 * Withdraws a single stake account
 */
async function withdrawStakeAccount(connection, signer, stake, destination, index, total) {
    info(`\n[${index + 1}/${total}] Withdrawing stake account ${stake.address.toString().slice(0, 8)}...`);
    info(`  Amount: ${stake.balance / LAMPORTS_PER_SOL} SOL`);

    const withdrawIx = StakeProgram.withdraw({
        stakePubkey: stake.address,
        authorizedPubkey: signer.publicKey,
        toPubkey: destination,
        lamports: stake.balance
    });

    const withdrawTx = new Transaction().add(withdrawIx);
    const withdrawSig = await sendAndConfirmTransaction(connection, withdrawTx, signer);

    success(`✓ Withdrawal successful!`);
    info(`  Transaction: https://solscan.io/tx/${withdrawSig}`);

    // Wait for balance to update
    await new Promise(resolve => setTimeout(resolve, 2000));
}

/**
 * Withdraws all stake accounts
 * @returns {boolean} True if all withdrawals succeeded, false if any failed
 */
async function withdrawStakeAccounts(connection, signer, stakeAccounts, config) {
    if (stakeAccounts.length === 0) return true;

    info('━━━ Step 6: Stake Withdrawal ━━━\n');

    // Determine if we should withdraw
    const shouldWithdraw = config.shouldWithdrawStakes(stakeAccounts.length > 0);

    if (shouldWithdraw === null) {
        // Need to prompt
        const confirmed = await confirmAction('Do you want to withdraw stake accounts? (y/n): ');
        if (!confirmed) {
            warn('Skipping stake withdrawal.\n');
            return true; // Skipped by choice, not a failure
        }
    } else if (!shouldWithdraw) {
        warn('Skipping stake withdrawal.\n');
        return true; // Skipped by choice, not a failure
    }

    // Get withdrawal destination
    const destination = await getWithdrawDestination(config, signer);
    info(`\nWithdrawing to: ${destination.toString()}`);
    debug('Withdraw destination:', destination.toString());

    // Withdraw each stake account
    let allSucceeded = true;
    for (let i = 0; i < stakeAccounts.length; i++) {
        try {
            await withdrawStakeAccount(connection, signer, stakeAccounts[i], destination, i, stakeAccounts.length);
        } catch (e) {
            error(`✗ Failed to withdraw stake account:`, e.message);
            debug('Full error:', e);
            warn('Continuing with next stake account...');
            allSucceeded = false;
        }
    }

    if (allSucceeded) {
        success('\n✓ All stake withdrawals completed!\n');
    } else {
        warn('\n⚠ Some stake withdrawals failed\n');
    }

    return allSucceeded;
}

/**
 * Performs final transfer
 * @returns {boolean} True if transfer succeeded or was skipped, false if failed
 */
async function performFinalTransfer(connection, signer, config) {
    info('━━━ Step 7: Final Transfer ━━━\n');

    const shouldTransfer = config.shouldDoFinalTransfer();

    let finalDestination = config.getTransferDestination();

    // If we need to prompt
    if (shouldTransfer === null) {
        const confirmed = await confirmAction('Do you want to transfer all funds to another address? (y/n): ');
        if (!confirmed) {
            warn('Skipping final transfer.\n');
            return true; // Skipped by choice, not a failure
        }
        finalDestination = await prompt('Enter final destination address: ');
    }

    // If no transfer needed
    if (shouldTransfer === false || !finalDestination || !finalDestination.trim()) {
        warn('Skipping final transfer.\n');
        return true; // Skipped by choice, not a failure
    }

    try {
        const destinationPubkey = new PublicKey(finalDestination.trim());

        // Get updated balance
        const currentBalance = await connection.getBalance(signer.publicKey);
        info(`\nCurrent wallet balance: ${currentBalance / LAMPORTS_PER_SOL} SOL`);
        debug('Current balance in lamports:', currentBalance);

        // Calculate amount to send (leave enough for fee)
        const amountToSend = currentBalance - DEFAULT_TRANSACTION_FEE;
        debug(`Transaction fee: ${DEFAULT_TRANSACTION_FEE} lamports`);

        if (amountToSend <= 0) {
            error('✗ Insufficient balance for transfer\n');
            return false;
        }

        info(`Sending ${amountToSend / LAMPORTS_PER_SOL} SOL to ${destinationPubkey.toString()}...`);
        debug('Amount to send in lamports:', amountToSend);

        const transferIx = SystemProgram.transfer({
            fromPubkey: signer.publicKey,
            toPubkey: destinationPubkey,
            lamports: amountToSend
        });

        const transferTx = new Transaction().add(transferIx);
        const transferSig = await sendAndConfirmTransaction(connection, transferTx, signer);

        success('✓ Transfer complete!');
        info(`  Transaction: https://solscan.io/tx/${transferSig}\n`);
        return true;
    } catch (e) {
        error('✗ Transfer failed:', e.message);
        debug('Full error:', e);
        return false;
    }
}

module.exports = {
    validateInputFiles,
    decryptAndCreateSigner,
    connectToSolana,
    checkBalance,
    collectStakeAccounts,
    displayTotalBalances,
    withdrawStakeAccounts,
    performFinalTransfer
};
