// Default file paths
const DEFAULT_KEYSTORE_PATH = 'solflare-keystore.json';
const DEFAULT_PASSWORD_FILE = 'password.txt';
const DEFAULT_KEYPAIR_OUTPUT = 'wallet-keypair.json';

// Solana network defaults
const DEFAULT_RPC_URL = 'https://api.mainnet-beta.solana.com';
const DEFAULT_COMMITMENT = 'confirmed';

// Transaction defaults
const DEFAULT_TRANSACTION_FEE = 5000; // lamports

module.exports = {
    DEFAULT_KEYSTORE_PATH,
    DEFAULT_PASSWORD_FILE,
    DEFAULT_KEYPAIR_OUTPUT,
    DEFAULT_RPC_URL,
    DEFAULT_COMMITMENT,
    DEFAULT_TRANSACTION_FEE
};
