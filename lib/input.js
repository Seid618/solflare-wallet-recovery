const fs = require('fs');
const { PublicKey } = require('@solana/web3.js');
const { prompt, debug, info, success, error, warn } = require('./utils');

/**
 * Validates that a file exists
 */
function validateFileExists(filePath, fileType) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`${fileType} file not found: ${filePath}`);
    }
}

/**
 * Collects stake account addresses interactively
 */
async function collectStakeAccountsInteractive(connection) {
    const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
    const stakeAccounts = [];
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
 * Validates and loads stake accounts from addresses
 */
async function loadStakeAccounts(connection, addresses) {
    const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
    const stakeAccounts = [];

    for (const stakeAddress of addresses) {
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

/**
 * Prompts user for confirmation
 */
async function confirmAction(message) {
    const response = await prompt(message);
    return response.toLowerCase() === 'y';
}

module.exports = {
    validateFileExists,
    collectStakeAccountsInteractive,
    loadStakeAccounts,
    confirmAction
};
