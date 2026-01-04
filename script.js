const { program } = require('commander');
const { rl, debug, info, success, warn, error } = require('./lib/utils');
const { Config } = require('./lib/config');
const {
    validateInputFiles,
    decryptAndCreateSigner,
    connectToSolana,
    checkBalance,
    collectStakeAccounts,
    displayTotalBalances,
    withdrawStakeAccounts,
    performFinalTransfer
} = require('./lib/steps');
const packageJson = require('./package.json');

// Configure CLI options
program
    .name('solflare-wallet-recovery')
    .description('A comprehensive tool for recovering and managing legacy Solflare wallet keystores')
    .version(packageJson.version)
    .option('-k, --keystore <path>', 'path to keystore file (default: solflare-keystore.json)')
    .option('-p, --password <text>', 'password as text (can use environment variables)')
    .option('--password-file <path>', 'path to password file (alternative to -p)')
    .option('--decrypt-only', 'only decrypt keystore and save keypair, skip blockchain operations', false)
    .option('-r, --rpc <url>', 'Solana RPC URL (default: https://api.mainnet-beta.solana.com)')
    .option('-s, --stake-accounts <addresses...>', 'stake account addresses (space-separated)')
    .option('-w, --withdraw-to <address>', 'destination address for stake withdrawals (defaults to wallet)')
    .option('-t, --transfer-to <address>', 'final transfer destination address')
    .option('-y, --yes', 'skip all confirmation prompts (auto-confirm)', false)
    .option('--no-tips', 'hide tips message at the end')
    .parse(process.argv);

const options = program.opts();

/**
 * Main function that orchestrates the Solflare wallet recovery and transfer process
 * Coordinates all steps from file input to final transfer
 *
 * @async
 * @param {Object} opts - CLI options
 * @returns {Promise<void>}
 * @throws {Error} If any critical step fails
 */
async function main(opts) {
    console.log('╔═════════════════════════════════════════════════════╗');
    console.log('║     SOLFLARE WALLET RECOVERY & TRANSFER TOOL        ║');
    console.log('╚═════════════════════════════════════════════════════╝\n');

    try {
        // Create configuration
        const config = new Config(opts);

        // Step 1: Validate input files
        const { keystorePath, password } = await validateInputFiles(config);

        // Step 2: Decrypt and create signer
        const { signer } = decryptAndCreateSigner(keystorePath, password);

        // If decrypt-only mode, exit here
        if (opts.decryptOnly) {
            success('╔═════════════════════════════════════════════════════╗');
            success('║            DECRYPTION COMPLETE!                     ║');
            success('╚═════════════════════════════════════════════════════╝\n');
            info('Keypair has been decrypted and saved.');
            info('Use the saved keypair for blockchain operations.\n');
            return;
        }

        // Step 3: Connect to Solana
        const connection = await connectToSolana(config);

        // Step 4: Check wallet balance
        const walletBalance = await checkBalance(connection, signer);

        // Step 5: Collect stake accounts
        const stakeAccounts = await collectStakeAccounts(connection, config);

        // Display total balances
        displayTotalBalances(walletBalance, stakeAccounts);

        // Step 6: Withdraw stake accounts
        const withdrawSuccess = await withdrawStakeAccounts(connection, signer, stakeAccounts, config);

        // Step 7: Final transfer
        const transferSuccess = await performFinalTransfer(connection, signer, config);

        // Display completion message based on success/failure
        if (withdrawSuccess && transferSuccess) {
            success('╔═════════════════════════════════════════════════════╗');
            success('║                RECOVERY COMPLETE!                   ║');
            success('╚═════════════════════════════════════════════════════╝\n');
        } else {
            warn('╔═════════════════════════════════════════════════════╗');
            warn('║         RECOVERY COMPLETED WITH ERRORS              ║');
            warn('╚═════════════════════════════════════════════════════╝\n');
            if (!withdrawSuccess) {
                error('Some stake withdrawals failed. Check errors above.');
            }
            if (!transferSuccess) {
                error('Final transfer failed. Check error above.\n');
            }
        }

        // Display tips (unless --no-tips flag is set)
        if (opts.tips !== false) {
            info('If this tool helped you recover your funds, consider supporting:');
            info('  BTC: bc1qj24nen3z3en5n89eqg3dsh37cgjytmdqjsehq5');
            info('  ETH: 0xd4e249a6aeda20e318922ea448992df26d23bc3d');
            info('  SOL: 9cz2vBNaS9ZKnXzyLM1D7HjF1p9gwH4mYXamDpRg3UWN');
            info(' ')
            info('Tips appreciated but never required. This tool is free and open source.\n');
        }

    } catch (e) {
        error('✗ Error:', e.message);
        debug('Full error:', e);
    } finally {
        rl.close();
    }
}

main(options).catch(err => {
    error('✗ Fatal error:', err.message);
    debug('Full error:', err);
    rl.close();
    process.exit(1);
});
