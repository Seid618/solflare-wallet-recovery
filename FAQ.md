# Frequently Asked Questions (FAQ)

Common questions about the Solflare Wallet Recovery Tool.

---

## General Questions

### What is this tool for?
This tool helps you recover access to legacy Solflare wallets by decrypting keystore files. It's specifically designed for users who have a Solflare keystore file from the legacy version of Solflare and need to access their funds, withdraw staked SOL, or migrate to a new wallet.

### Is this safe to use?
Yes, this is open-source software that runs entirely on your local machine. You can review all the code before running it. Your private keys never leave your computer, and no data is sent to external servers. However, as with any tool that handles private keys, you should:
- Review the source code
- Verify you're using the official repository
- Keep your recovered keypair secure

### Do I need technical knowledge to use this?
Basic command-line knowledge is helpful, but the tool is designed to be user-friendly with interactive prompts that guide you through each step. If you can:
- Install Node.js
- Navigate to a folder in terminal/command prompt
- Run a command

Then you can use this tool.

---

### Will this work with the current Solflare wallet?
No, this tool is specifically for **legacy Solflare keystores**. The modern Solflare wallet uses a different format. If you're using the current Solflare browser extension or mobile app, you don't need this tool.

---

## Keystore and Password Questions

### What is a keystore file?
A keystore file is an encrypted JSON file that contains your wallet's private key. The file is encrypted with your password, so both the file and the password are required to access your wallet.

### Where can I find my keystore file?
Your keystore file should have been downloaded when you first created your legacy Solflare wallet, or you can download it from legacy Solflare by logging into your wallet and going to the settings/export section.

### What if I don't have my password?
Unfortunately, without your password, there's no way to decrypt the keystore file. The encryption is designed to be secure, and there's no backdoor or recovery method if you've lost your password. This is a fundamental security feature of cryptocurrency wallets.

### What if I lost my keystore file?
If you've lost your keystore file and don't have any other backup of your private key or seed phrase, there's no way to recover your wallet. This is why it's crucial to maintain secure backups of your wallet credentials.

### Can I use this if I only have my seed phrase?
This tool is designed for keystore files specifically. If you only have your seed phrase (12 or 24 words), you can import that directly into the modern Solflare wallet or other Solana-compatible wallets. You don't need this recovery tool for seed phrase recovery.

---

## Usage Questions

### What files do I need before running the tool?
You need two files:
1. Your Solflare keystore file (usually named something like `solflare-keystore.json`)
2. Your wallet password saved in a text file (e.g., `password.txt`)

See the README for detailed instructions on where to place these files.

### Can I recover my wallet without transferring funds?
Yes! The tool has multiple steps, and you can stop at any point. You can simply decrypt your keystore to verify access without making any transactions. All fund transfers are optional and require your confirmation.

### How long does the recovery process take?
The decryption itself is nearly instant. The overall time depends on:
- Whether you have stake accounts to withdraw from (each withdrawal requires a transaction)
- Network conditions (transaction confirmation times)
- How quickly you confirm each step

Typically, a simple recovery and transfer takes 2-5 minutes.

### Do I need to pay any fees?
Yes, you'll pay standard Solana network transaction fees (typically 0.000005 SOL per transaction). The tool will automatically calculate and reserve fees when transferring funds. There are no additional fees charged by this tool.

### What happens to the `wallet-keypair.json` file that's created?
This file contains your unencrypted private key in JSON format. It's created during the decryption process. **Keep this file extremely secure** or delete it after you've completed your recovery. Anyone with access to this file has full access to your wallet.

---

## Staking Questions

### What are stake accounts?
Stake accounts are separate Solana accounts where you can delegate SOL to validators to earn staking rewards. In legacy Solflare, you may have created one or more stake accounts.

### How do I find my stake account addresses?
When you log into legacy Solflare, your stake accounts are listed in the "Your staking accounts" section. You can copy each address from there. See the screenshots in the README for reference.

### Can I withdraw staked SOL that's still locked?
The tool will attempt to withdraw from your stake accounts, but if your SOL is in a "locked" or "activating" state due to the Solana staking schedule, you may need to wait until the unlock period completes before you can withdraw.

### Do I have to withdraw all my stake accounts?
No, the tool lets you enter stake account addresses one at a time. You can choose to withdraw from some, all, or none of your stake accounts.

---

## Troubleshooting

For detailed troubleshooting of common errors and issues, see [TROUBLESHOOTING](TROUBLESHOOTING.md).

---

## Security Concerns

### Could this tool steal my funds?
This is open-source software that you can review before running. All operations happen locally on your computer. However, you should always:
- Download from the official GitHub repository
- Review the code if you're able to

### Is it safe to transfer all my funds at once?
If you're transferring to a wallet you control and have verified the address, yes. However, you might want to:
- Test with a small amount first
- Double-check the destination address
- Ensure you're not sending to an exchange deposit address that requires a memo

---

## Platform-Specific Questions

### Does this work on Windows?
Yes, as long as you have Node.js installed. Use Command Prompt or PowerShell to run the commands.

### Does this work on Mac?
Yes, use Terminal to run the commands.

### Does this work on Linux?
Yes, use your terminal emulator of choice.

### Can I run this on a server or VPS?
Yes, but for security reasons, it's recommended to run this on your personal computer rather than a shared or cloud server where your private keys might be exposed.

---

## After Recovery

### Should I continue using my recovered wallet?
It's generally recommended to migrate to a modern wallet solution (like the current Solflare wallet, Phantom, or hardware wallets) for better security and features. This tool is designed to help you access and move your funds, not for ongoing wallet management.

### Can I import my recovered keypair into another wallet?
Yes, the `wallet-keypair.json` file can be imported into other Solana-compatible tools and wallets that support private key import. However, each wallet has different import processes.

### What if I need to recover funds again later?
You can use this tool as many times as needed, as long as you have your keystore and password. However, once you've migrated to a modern wallet, you should use that wallet's native tools for access rather than repeatedly using this recovery tool.

---

## Getting Help

### Where can I get more help?
- Check [TROUBLESHOOTING](TROUBLESHOOTING.md) for common issues
- Open an issue on [GitHub Issues](https://github.com/thijmau/solflare-wallet-recovery/issues)

### How can I contribute or report bugs?
Visit the GitHub repository and:
- Report bugs by opening an issue
- Suggest improvements through issues or pull requests
- Help others in the issues section if you've successfully used the tool

### Is there official support from Solflare?
No, this is an independent community tool. For official Solflare support, visit **Solflare Documentation** - [https://docs.solflare.com](https://docs.solflare.com) or contact Solflare directly.