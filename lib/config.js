const fs = require('fs');
const { prompt, debug, info } = require('./utils');
const {
    DEFAULT_KEYSTORE_PATH,
    DEFAULT_PASSWORD_FILE,
    DEFAULT_RPC_URL
} = require('./constants');

/**
 * Configuration manager that determines all settings upfront
 * Handles both interactive and non-interactive modes
 */
class Config {
    constructor(opts = {}) {
        this.opts = opts;
        // Check if password was explicitly provided (even if empty)
        this.isInteractive = opts.password === undefined && opts.passwordFile === undefined;

        debug('Config initialized');
        debug('Mode:', this.isInteractive ? 'interactive' : 'non-interactive');
        this._logProvidedOptions();
    }

    /**
     * Logs which options were explicitly provided by the user (excludes defaults)
     * @private
     */
    _logProvidedOptions() {
        const provided = this._getProvidedOptions();

        if (provided.length > 0) {
            debug('Provided:', provided.join(', '));
        } else {
            debug('Using defaults only');
        }
    }

    /**
     * Gets list of options explicitly provided by user
     * @private
     * @returns {string[]} Array of option names
     */
    _getProvidedOptions() {
        const opts = this.opts;
        const provided = [];

        if (opts.password !== undefined) provided.push('password');
        if (opts.passwordFile !== undefined) provided.push('passwordFile');
        if (opts.keystore !== undefined) provided.push('keystore');
        if (opts.rpc !== undefined) provided.push('rpc');
        if (opts.stakeAccounts !== undefined && opts.stakeAccounts.length > 0) provided.push('stakeAccounts');
        if (opts.withdrawTo !== undefined) provided.push('withdrawTo');
        if (opts.transferTo !== undefined) provided.push('transferTo');
        if (opts.decryptOnly) provided.push('decryptOnly');
        if (opts.yes) provided.push('yes');
        if (opts.tips === false) provided.push('no-tips');

        return provided;
    }

    /**
     * Gets the keystore path (from opts or prompt)
     */
    async getKeystorePath() {
        // If keystore was provided via CLI, use it (even if empty or default value)
        if (this.opts.keystore !== undefined) {
            debug(`Using keystore from CLI: ${this.opts.keystore}`);
            return this.opts.keystore;
        }

        // Interactive mode - prompt user
        if (this.isInteractive) {
            const input = await prompt(`Enter keystore file path (press Enter to use default: ${DEFAULT_KEYSTORE_PATH}): `);
            const path = input.trim() || DEFAULT_KEYSTORE_PATH;
            debug(`Keystore path from prompt: ${path}`);
            return path;
        }

        // Non-interactive with no keystore specified - use default
        debug(`Using default keystore: ${DEFAULT_KEYSTORE_PATH}`);
        return DEFAULT_KEYSTORE_PATH;
    }

    /**
     * Gets the password (from text, file, or prompt)
     */
    async getPassword() {
        // Priority: text password > password file > prompt for file
        if (this.opts.password !== undefined) {
            debug('Using password from CLI text');
            return this.opts.password;
        }

        if (this.opts.passwordFile !== undefined) {
            debug(`Reading password from file: ${this.opts.passwordFile}`);
            if (!fs.existsSync(this.opts.passwordFile)) {
                throw new Error(`Password file not found: ${this.opts.passwordFile}`);
            }
            return fs.readFileSync(this.opts.passwordFile, 'utf8');
        }

        // Interactive mode - prompt for password file
        const passwordFile = await prompt(`Enter password file path (press Enter to use default: ${DEFAULT_PASSWORD_FILE}): `);
        const passwordPath = passwordFile.trim() || DEFAULT_PASSWORD_FILE;
        debug(`Reading password from: ${passwordPath}`);

        if (!fs.existsSync(passwordPath)) {
            throw new Error(`Password file not found: ${passwordPath}`);
        }

        return fs.readFileSync(passwordPath, 'utf8');
    }

    /**
     * Gets the RPC URL
     */
    async getRpcUrl() {
        // If RPC was provided via CLI, use it (even if empty or default value)
        if (this.opts.rpc !== undefined) {
            debug(`Using RPC from CLI: ${this.opts.rpc}`);
            return this.opts.rpc;
        }

        // Interactive mode - prompt user
        if (this.isInteractive) {
            const input = await prompt(`Enter RPC URL (press Enter to use default: ${DEFAULT_RPC_URL}): `);
            const url = input.trim() || DEFAULT_RPC_URL;
            debug(`RPC URL from prompt: ${url}`);
            return url;
        }

        // Non-interactive with no RPC specified - use default
        debug(`Using default RPC: ${DEFAULT_RPC_URL}`);
        return DEFAULT_RPC_URL;
    }

    /**
     * Gets stake account addresses
     */
    async getStakeAccounts() {
        if (this.opts.stakeAccounts && this.opts.stakeAccounts.length > 0) {
            debug(`Using ${this.opts.stakeAccounts.length} stake accounts from CLI`);
            return this.opts.stakeAccounts;
        }

        if (!this.isInteractive) {
            debug('Non-interactive mode: no stake accounts specified');
            return [];
        }

        // Interactive mode - will be handled by collectStakeAccounts
        debug('Interactive mode: stake accounts will be collected interactively');
        return null;
    }

    /**
     * Determines if stake accounts should be withdrawn
     */
    shouldWithdrawStakes(hasStakeAccounts) {
        if (!hasStakeAccounts) {
            debug('No stake accounts to withdraw');
            return false;
        }
        if (this.opts.yes) {
            debug('Auto-confirm enabled: will withdraw stakes');
            return true;
        }
        if (!this.isInteractive) {
            debug('Non-interactive mode: auto-withdrawing stakes');
            return true;
        }
        debug('Interactive mode: will prompt for stake withdrawal');
        return null; // Will prompt
    }

    /**
     * Gets withdrawal destination address
     */
    getWithdrawDestination() {
        const destination = this.opts.withdrawTo || null;
        if (destination) {
            debug(`Using withdrawal destination from CLI: ${destination}`);
        } else {
            debug('No withdrawal destination specified, will use wallet or prompt');
        }
        return destination;
    }

    /**
     * Determines if final transfer should be performed
     */
    shouldDoFinalTransfer() {
        if (this.opts.transferTo) {
            debug('Transfer destination specified: will perform final transfer');
            return true;
        }
        if (!this.isInteractive) {
            debug('Non-interactive mode: skipping final transfer (no destination)');
            return false;
        }
        debug('Interactive mode: will prompt for final transfer');
        return null; // Will prompt
    }

    /**
     * Gets final transfer destination address
     */
    getTransferDestination() {
        const destination = this.opts.transferTo || null;
        if (destination) {
            debug(`Using transfer destination from CLI: ${destination}`);
        } else {
            debug('No transfer destination specified');
        }
        return destination;
    }
}

module.exports = { Config };
