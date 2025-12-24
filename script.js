const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { rl, debug, info, success, error } = require('./lib/utils');
const {
    getInputFiles,
    decryptAndCreateSigner,
    connectToSolana,
    collectStakeAccounts,
    withdrawStakeAccounts,
    performFinalTransfer
} = require('./lib/steps');

/**
 * Main function that orchestrates the Solflare wallet recovery and transfer process
 * Coordinates all steps from file input to final transfer
 *
 * @async
 * @returns {Promise<void>}
 * @throws {Error} If any critical step fails
 */
async function main() {
    console.log('╔═════════════════════════════════════════════════════╗');
    console.log('║     SOLFLARE WALLET RECOVERY & TRANSFER TOOL        ║');
    console.log('╚═════════════════════════════════════════════════════╝\n');

    try {
        // Step 1: Get input files
        const { keystorePath, passwordPath } = await getInputFiles();

        // Step 2: Decrypt and create signer
        const { signer, publicKey } = await decryptAndCreateSigner(keystorePath, passwordPath);

        // Step 3: Connect to Solana
        const connection = await connectToSolana();

        // Step 4: Check wallet balance
        info('━━━ Step 4: Checking Balances ━━━\n');
        const walletBalance = await connection.getBalance(signer.publicKey);
        info('Wallet Balance:', walletBalance / LAMPORTS_PER_SOL, 'SOL');
        info('Wallet Address:', signer.publicKey.toString());
        debug('Wallet balance in lamports:', walletBalance);

        // Step 5: Collect stake accounts
        const stakeAccounts = await collectStakeAccounts(connection);

        // Display total balances
        const totalStakeBalance = stakeAccounts.reduce((sum, acc) => sum + acc.balance, 0);
        const totalBalance = walletBalance + totalStakeBalance;
        info('\n━━━ Total Balances ━━━');
        info('  Wallet:', walletBalance / LAMPORTS_PER_SOL, 'SOL');
        info('  Stake Accounts:', totalStakeBalance / LAMPORTS_PER_SOL, 'SOL');
        info('  Total:', totalBalance / LAMPORTS_PER_SOL, 'SOL\n');

        // Step 6: Withdraw stake accounts
        await withdrawStakeAccounts(connection, signer, stakeAccounts);

        // Step 7: Final transfer
        await performFinalTransfer(connection, signer);

        success('╔═════════════════════════════════════════════════════╗');
        success('║                RECOVERY COMPLETE!                   ║');
        success('╚═════════════════════════════════════════════════════╝\n');

        // Display tips
        info('If this tool helped you recover your funds, consider supporting:');
        info('  BTC: bc1qj24nen3z3en5n89eqg3dsh37cgjytmdqjsehq5');
        info('  ETH: 0xd4e249a6aeda20e318922ea448992df26d23bc3d');
        info('  SOL: 9cz2vBNaS9ZKnXzyLM1D7HjF1p9gwH4mYXamDpRg3UWN');
        info(' ')
        info('Tips appreciated but never required. This tool is free and open source.\n');

    } catch (e) {
        error('✗ Error:', e.message);
        debug('Full error:', e);
    } finally {
        rl.close();
    }
}

main().catch(err => {
    error('✗ Fatal error:', err.message);
    debug('Full error:', err);
    rl.close();
    process.exit(1);
});
