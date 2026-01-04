const fs = require('fs');
const pbkdf2 = require('pbkdf2');
const aesjs = require('aes-js');
const nacl = require('tweetnacl');
const bs58 = require('bs58').default;
const { PublicKey } = require('@solana/web3.js');
const { debug } = require('./utils');

/**
 * Decrypts a Solflare keystore file using the solflare-decrypt method
 * Uses PBKDF2 for key derivation and AES-CTR for decryption
 * Verifies the resulting keypair can create valid signatures
 *
 * @param {string} keystorePath - Path to the Solflare keystore JSON file
 * @param {string} password - Password as string
 * @returns {{keypairBytes: Buffer, publicKey: string}} Object containing the decrypted keypair bytes and public key
 * @throws {Error} If decryption fails or produces invalid keypair
 */
function decryptKeystore(keystorePath, password) {
    debug('Reading keystore...');
    const keystore = JSON.parse(fs.readFileSync(keystorePath, 'utf8'));
    password = password.trim();

    debug('Expected public key:', keystore.publicKey);

    const options = keystore.Crypto.kdfparams;
    debug('Deriving decryption key using PBKDF2...');

    // Use pbkdf2 library with salt as string (not converted to buffer!)
    const key = pbkdf2.pbkdf2Sync(
        password,
        options.salt,
        options.c,
        options.dklen,
        options.prf
    );

    debug('Decrypting with AES-CTR...');
    const encryptedBytes = aesjs.utils.hex.toBytes(keystore.Crypto.ciphertext);
    const counter = keystore.Crypto.cipherparams.counter;
    const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(counter));
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);

    debug('Decrypted bytes length:', decryptedBytes.length);

    // Verify the keypair
    if (decryptedBytes.length === 64) {
        const kp = nacl.sign.keyPair.fromSecretKey(decryptedBytes);
        const pk = bs58.encode(Buffer.from(kp.publicKey));

        debug('Derived public key:', pk);

        if (pk === keystore.publicKey) {
            debug('✓ Public key matches!');

            // Verify signature works
            const testMessage = Buffer.from('test');
            const testSig = nacl.sign.detached(testMessage, kp.secretKey);
            const sigVerifies = nacl.sign.detached.verify(testMessage, testSig, kp.publicKey);

            if (sigVerifies) {
                debug('✓ Signature verification successful!');
                return { keypairBytes: Buffer.from(decryptedBytes), publicKey: keystore.publicKey };
            } else {
                throw new Error('Decryption produced invalid keypair - signatures do not verify');
            }
        } else {
            throw new Error(`Public key mismatch! Expected ${keystore.publicKey}, got ${pk}`);
        }
    }

    throw new Error('Decryption failed - invalid output length');
}

/**
 * Creates a signer object for Solana transactions from a secret key
 * Uses tweetnacl to generate the keypair and wraps it in Solana-compatible format
 *
 * @param {Uint8Array} secretKey - The 64-byte secret key (seed + public key)
 * @returns {{publicKey: PublicKey, secretKey: Uint8Array}} Signer object with Solana PublicKey and tweetnacl secret key
 */
function createSigner(secretKey) {
    const kp = nacl.sign.keyPair.fromSecretKey(secretKey);
    return {
        publicKey: new PublicKey(kp.publicKey),
        secretKey: kp.secretKey
    };
}

module.exports = {
    decryptKeystore,
    createSigner
};
