# Troubleshooting

Common issues and solutions for the Solflare Wallet Recovery Tool.

## "Keystore file not found"

**Problem:** The tool can't find your keystore file.

**Solutions:**
- Ensure your keystore file exists at the specified path
- Default expected path: `./solflare-keystore.json` (in the project root)
- Check that you're running the script from the project root directory
- Verify the filename is correct (case-sensitive)

## "Public key mismatch"

**Problem:** The decrypted keypair doesn't match the expected public key.

**Solutions:**
- Verify your password is correct
- Ensure the keystore file isn't corrupted
- Make sure you're using the correct password file for this keystore
- Try downloading the keystore file again if available

## "Transaction simulation failed"

**Problem:** Stake withdrawal or transfer transaction fails during simulation.

**Solutions:**
- Check that the stake account has sufficient balance
- Verify the stake account is fully activated (not in warmup period)
- Ensure you have authority over the stake account
- Confirm the stake account address is correct
- Check if the stake account has already been withdrawn

## Rate Limiting

**Problem:** Getting "429 Too Many Requests" errors from the RPC.

**Solutions:**
- If using public RPC endpoints, you may hit rate limits
- Wait a few minutes and try again
- Consider using a private RPC endpoint for better reliability
- Use a premium RPC service like QuickNode, Helius, or Alchemy

## Recovery Succeeded but Transfer Failed

**Problem:** The keystore was successfully decrypted, but the transfer step failed.

**Good news:** Your recovery was successful! The keypair is saved.

**Solutions:**

Your recovered keypair is saved in `wallet-keypair.json`. You can use the official Solana CLI to complete the transfer manually:

1. **Install Solana CLI:**
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
   ```
   Or visit: https://docs.solana.com/cli/install-solana-cli-tools

2. **Check your balance:**
   ```bash
   solana balance --keypair wallet-keypair.json
   ```

3. **Withdraw from stake accounts first** (if you have any):
   ```bash
   solana stake-account --keypair wallet-keypair.json <stake_account_address>
   solana withdraw-stake --keypair wallet-keypair.json <stake_account> <destination> <amount>
   ```

4. **Then transfer all funds:**
   ```bash
   solana transfer --keypair wallet-keypair.json <destination_address> <amount>
   ```

## "Signature verification failed"

**Problem:** Transaction signatures are not valid.

**Solutions:**
- This usually indicates an issue with the decryption process
- Make sure you're using the correct password
- Ensure the keystore file is not corrupted
- Try running the recovery process again from the beginning

## Network Connection Issues

**Problem:** Can't connect to Solana network.

**Solutions:**
- Check your internet connection
- Verify the RPC URL is correct
- Try using a different RPC endpoint
- Default: `https://api.mainnet-beta.solana.com`
- Alternative: Use a custom RPC when prompted

## Insufficient Balance for Transfer

**Problem:** "Insufficient balance for transfer" error.

**Explanation:**
- The tool reserves 5000 lamports (~0.000005 SOL) for the transaction fee
- If your balance is less than this, the transfer cannot proceed

**Solutions:**
- Your funds are safe in `wallet-keypair.json`
- Use the Solana CLI to make a transfer with a smaller fee
- Or leave the small amount and transfer to a new wallet

## Still Having Issues?

If your problem isn't listed here:

1. **Check debug logs** - The tool outputs detailed debug information
2. **Open an issue** on [GitHub](https://github.com/thijmau/solflare-wallet-recovery/issues)
3. **Important:** Never share your keystore file, password, or private keys when asking for help

## Security Reminder

⚠️ If you've successfully recovered your keypair:
- The `wallet-keypair.json` file contains your private key
- Store it securely
- Never share it
- Consider transferring funds to a new, secure wallet
- Delete sensitive files after successful recovery
