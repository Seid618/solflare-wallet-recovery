const nacl = require('tweetnacl');
const { debug } = require('./utils');

/**
 * Signs, sends, and confirms a Solana transaction using manual tweetnacl signing
 * Sets the fee payer, signs with the provided signer, and waits for confirmation
 *
 * @param {Connection} connection - Solana connection object
 * @param {Transaction} transaction - The transaction to sign and send
 * @param {{publicKey: PublicKey, secretKey: Uint8Array}} signer - Signer object with public key and secret key
 * @returns {Promise<string>} Promise that resolves with the transaction signature
 * @throws {Error} If transaction fails to send or confirm
 */
async function sendAndConfirmTransaction(connection, transaction, signer) {
    debug('Getting recent blockhash...');
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = signer.publicKey;

    debug('Signing transaction...');
    const message = transaction.serializeMessage();
    debug('Message length:', message.length);
    debug('Message (first 32 bytes):', message.slice(0, 32));
    debug('Signer public key:', signer.publicKey.toString());
    debug('Signer secret key length:', signer.secretKey.length);

    const signature = nacl.sign.detached(message, signer.secretKey);
    debug('Signature length:', signature.length);
    debug('Signature (first 32 bytes):', signature.slice(0, 32));

    transaction.addSignature(signer.publicKey, Buffer.from(signature));
    debug('Signature added to transaction');

    debug('Sending transaction...');
    const rawTransaction = transaction.serialize();
    const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
        preflightCommitment: 'confirmed'
    });

    debug('Confirming transaction...');
    await connection.confirmTransaction({
        signature: txid,
        blockhash,
        lastValidBlockHeight
    }, 'confirmed');

    return txid;
}

module.exports = {
    sendAndConfirmTransaction
};
