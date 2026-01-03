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

/**
 * Prompts for and validates input file paths for keystore and password
 *
 * @async
 * @param {Object} opts - CLI options
 * @returns {Promise<{keystorePath: string, passwordPath: string}>} Validated file paths
 * @throws {Error} If files don't exist
 */
async function getInputFiles(opts = {}) {
    info('━━━ Step 1: File Input ━━━\n');

    let keystorePath = opts.keystore || 'solflare-keystore.json';
    let passwordPath = opts.password || 'password.txt';

    // Only prompt if CLI options were not provided
    if (!opts.keystore) {
        const keystoreFile = await prompt('Enter keystore file path (default: solflare-keystore.json): ');
        keystorePath = keystoreFile.trim() || 'solflare-keystore.json';
    }

    if (!opts.password) {
        const passwordFile = await prompt('Enter password file path (default: password.txt): ');
        passwordPath = passwordFile.trim() || 'password.txt';
    }

    debug(`Using keystore: ${keystorePath}`);
    debug(`Using password file: ${passwordPath}`);

    // Validate files exist
    if (!fs.existsSync(keystorePath)) {
        throw new Error(`Keystore file not found: ${keystorePath}`);
    }

    if (!fs.existsSync(passwordPath)) {
        throw new Error(`Password file not found: ${passwordPath}`);
    }

    success('✓ Files validated\n');
    return { keystorePath, passwordPath };
}

/**
 * Decrypts the keystore and creates a verified signer
 *
 * @async
 * @param {string} keystorePath - Path to keystore file
 * @param {string} passwordPath - Path to password file
 * @returns {Promise<{signer: Object, publicKey: string}>} Signer object and public key
 * @throws {Error} If decryption or verification fails
 */
async function decryptAndCreateSigner(keystorePath, passwordPath) {
    info('━━━ Step 2: Decrypting Keystore ━━━\n');

    const result = decryptKeystore(keystorePath, passwordPath);
    const keypairBytes = result.keypairBytes;
    const publicKey = result.publicKey;

    success('✓ Keystore decrypted successfully!');
    success('✓ Public Key:', publicKey);

    // Save to wallet-keypair.json
    fs.writeFileSync('wallet-keypair.json', JSON.stringify(Array.from(keypairBytes)));
    success('✓ Keypair saved to wallet-keypair.json\n');
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
 * Connects to Solana network via RPC
 *
 * @async
 * @param {Object} opts - CLI options
 * @returns {Promise<Connection>} Solana connection object
 */
async function connectToSolana(opts = {}) {
    info('━━━ Step 3: Connecting to Solana ━━━\n');

    let rpcUrl = opts.rpc || 'https://api.mainnet-beta.solana.com';

    // Only prompt if CLI option was not provided
    if (!opts.rpc) {
        const userRpcUrl = await prompt('Enter RPC URL (default: https://api.mainnet-beta.solana.com): ');
        rpcUrl = userRpcUrl.trim() || 'https://api.mainnet-beta.solana.com';
    }

    const connection = new Connection(rpcUrl, 'confirmed');

    success('✓ Connected to Solana\n');
    debug('Using RPC:', rpcUrl);

    return connection;
}

/**
 * Collects stake account addresses from user input or CLI options
 *
 * @async
 * @param {Connection} connection - Solana connection object
 * @param {Object} opts - CLI options
 * @returns {Promise<Array<{address: PublicKey, balance: number}>>} Array of stake accounts with balances
 */
async function collectStakeAccounts(connection, opts = {}) {
    info('━━━ Step 5: Staking Accounts ━━━\n');

    const stakeAccounts = [];

    // If stake accounts provided via CLI, use those
    if (opts.stakeAccounts && opts.stakeAccounts.length > 0) {
        for (const stakeAddress of opts.stakeAccounts) {
            try {
                const stakePubkey = new PublicKey(stakeAddress.trim());
                const stakeBalance = await connection.getBalance(stakePubkey);

                stakeAccounts.push({
                    address: stakePubkey,
                    balance: stakeBalance
                });

                success(`✓ Stake account ${stakeAccounts.length}: ${stakePubkey.toString()}`);
                info(`  Balance: ${stakeBalance / LAMPORTS_PER_SOL} SOL`);
                debug(`Stake account ${stakeAccounts.length} balance in lamports:`, stakeBalance);
            } catch (e) {
                error(`✗ Invalid stake account address: ${stakeAddress}`);
                debug('Error:', e.message);
            }
        }
        return stakeAccounts;
    }

    // Otherwise, prompt interactively
    let addMore = true;
    while (addMore) {
        const stakeAddress = await prompt(`Enter stake account address ${stakeAccounts.length + 1} (or press Enter to skip): `);

        if (!stakeAddress.trim()) {
            if (stakeAccounts.length === 0) {
                warn('No stake accounts added.\n');
            }
            break;
        }

        try {
            const stakePubkey = new PublicKey(stakeAddress.trim());
            const stakeBalance = await connection.getBalance(stakePubkey);

            stakeAccounts.push({
                address: stakePubkey,
                balance: stakeBalance
            });

            success(`✓ Stake account ${stakeAccounts.length}: ${stakePubkey.toString()}`);
            info(`  Balance: ${stakeBalance / LAMPORTS_PER_SOL} SOL`);
            debug(`Stake account ${stakeAccounts.length} balance in lamports:`, stakeBalance);

            const more = await prompt('Add another stake account? (y/n): ');
            addMore = more.toLowerCase() === 'y';
        } catch (e) {
            error('✗ Invalid stake account address, try again.');
            debug('Error:', e.message);
        }
    }

    return stakeAccounts;
}

/**
 * Withdraws funds from stake accounts
 *
 * @async
 * @param {Connection} connection - Solana connection object
 * @param {Object} signer - Signer object with public key and secret key
 * @param {Array<{address: PublicKey, balance: number}>} stakeAccounts - Stake accounts to withdraw from
 * @param {Object} opts - CLI options
 * @returns {Promise<void>}
 */
async function withdrawStakeAccounts(connection, signer, stakeAccounts, opts = {}) {
    if (stakeAccounts.length === 0) return;

    info('━━━ Step 6: Stake Withdrawal ━━━\n');

    // Determine if we should withdraw
    let shouldWithdraw = opts.yes || false;
    if (!opts.yes && stakeAccounts.length > 0) {
        const response = await prompt('Do you want to withdraw stake accounts? (y/n): ');
        shouldWithdraw = response.toLowerCase() === 'y';
    }

    if (!shouldWithdraw && stakeAccounts.length > 0) {
        warn('Skipping stake withdrawal.\n');
        return;
    }

    // Determine withdrawal destination
    let withdrawDestination = signer.publicKey;
    if (opts.withdrawTo) {
        withdrawDestination = new PublicKey(opts.withdrawTo);
    } else if (!opts.yes) {
        const withdrawTo = await prompt(`Enter destination address (press Enter to withdraw to current wallet ${signer.publicKey.toString().slice(0, 8)}...): `);
        withdrawDestination = withdrawTo.trim()
            ? new PublicKey(withdrawTo.trim())
            : signer.publicKey;
    }

    info(`\nWithdrawing to: ${withdrawDestination.toString()}`);
    debug('Withdraw destination:', withdrawDestination.toString());

    // Withdraw each stake account
    for (let i = 0; i < stakeAccounts.length; i++) {
        const stake = stakeAccounts[i];
        info(`\n[${i + 1}/${stakeAccounts.length}] Withdrawing stake account ${stake.address.toString().slice(0, 8)}...`);
        info(`  Amount: ${stake.balance / LAMPORTS_PER_SOL} SOL`);

        try {
            const withdrawIx = StakeProgram.withdraw({
                stakePubkey: stake.address,
                authorizedPubkey: signer.publicKey,
                toPubkey: withdrawDestination,
                lamports: stake.balance
            });

            const withdrawTx = new Transaction().add(withdrawIx);
            const withdrawSig = await sendAndConfirmTransaction(connection, withdrawTx, signer);

            success(`✓ Withdrawal successful!`);
            info(`  Transaction: https://solscan.io/tx/${withdrawSig}`);

            // Wait for balance to update
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
            error(`✗ Failed to withdraw stake account:`, e.message);
            debug('Full error:', e);
            warn('Continuing with next stake account...');
        }
    }

    success('\n✓ All stake withdrawals completed!\n');
}

/**
 * Performs final transfer of all funds to a destination address
 *
 * @async
 * @param {Connection} connection - Solana connection object
 * @param {Object} signer - Signer object with public key and secret key
 * @param {Object} opts - CLI options
 * @returns {Promise<void>}
 */
async function performFinalTransfer(connection, signer, opts = {}) {
    info('━━━ Step 7: Final Transfer ━━━\n');

    // Check if we have a destination from CLI or need to prompt
    let finalDestination = opts.transferTo;

    if (!finalDestination && !opts.yes) {
        const shouldTransfer = await prompt('Do you want to transfer all funds to another address? (y/n): ');

        if (shouldTransfer.toLowerCase() !== 'y') {
            warn('Skipping final transfer.\n');
            return;
        }

        finalDestination = await prompt('Enter final destination address: ');
    }

    if (!finalDestination || !finalDestination.trim()) {
        if (opts.transferTo === undefined) {
            warn('Skipping final transfer.\n');
        } else {
            error('✗ No destination provided, skipping transfer.\n');
        }
        return;
    }

    try {
        const destinationPubkey = new PublicKey(finalDestination.trim());

        // Get updated balance
        const currentBalance = await connection.getBalance(signer.publicKey);
        info(`\nCurrent wallet balance: ${currentBalance / LAMPORTS_PER_SOL} SOL`);
        debug('Current balance in lamports:', currentBalance);

        // Calculate amount to send (leave enough for fee)
        const fee = 5000; // lamports
        const amountToSend = currentBalance - fee;

        if (amountToSend <= 0) {
            error('✗ Insufficient balance for transfer\n');
            return;
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
    } catch (e) {
        error('✗ Transfer failed:', e.message);
        debug('Full error:', e);
    }
}

module.exports = {
    getInputFiles,
    decryptAndCreateSigner,
    connectToSolana,
    collectStakeAccounts,
    withdrawStakeAccounts,
    performFinalTransfer
};
