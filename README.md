# Solflare Wallet Recovery Tool

> A comprehensive command-line tool for recovering and managing legacy Solflare wallet keystores, including stake account withdrawals and fund transfers.

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Version](https://img.shields.io/badge/version-1.2.0-orange)](package.json)
[![Security Audit](https://github.com/thijmau/solflare-wallet-recovery/actions/workflows/security-audit.yml/badge.svg)](https://github.com/thijmau/solflare-wallet-recovery/actions/workflows/security-audit.yml)

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [Security](#security)
- [Support](#support--contributing)

---

## Overview

### Can't Access Your Legacy Solflare Wallet?

This tool solves common problems with legacy Solflare wallets:

- Locked out of legacy Solflare wallet
- Can't access Solflare keystore file
- Need to recover funds from [https://legacy.solflare.com](https://legacy.solflare.com)
- Unable to withdraw staked SOL from old accounts
- Migrating from legacy Solflare to modern wallet

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/thijmau/solflare-wallet-recovery.git
cd solflare-wallet-recovery
npm install

# 2. Prepare your keystore file
# Place solflare-keystore.json in the project root

# 3. Run the tool (interactive mode)
npm start

# Or with password from environment variable (single-shot)
node script.js -p "$PASSWORD"

# Or with password file
node script.js --password-file password.txt
```

---

## Features

This tool provides a complete recovery and retrieval solution:

| Feature                   | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| **Keystore Decryption**   | Decrypt legacy Solflare keystore files using your password |
| **Decrypt-Only Mode**     | Fast, offline decryption without blockchain operations     |
| **Balance Checking**      | View wallet and stake account balances                     |
| **Stake Withdrawal**      | Unstake and withdraw SOL from multiple stake accounts      |
| **Fund Transfer**         | Transfer recovered funds to a new wallet                   |
| **Environment Variables** | Pass passwords securely via environment variables          |
| **CLI Automation**        | Scriptable with command-line flags for batch recovery      |
| **Interactive Mode**      | Step-by-step guided recovery process                       |

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** v14.0.0 or higher - [https://nodejs.org/](https://nodejs.org/)
- **Solflare keystore file** (`.json` format)
- **Wallet password** (saved in a text file)

---

## Setup

### Getting Your Keystore and Password

> **Example files available:** Check `docs/` directory for sample file formats
> - `docs/solflare-keystore.example.json`
> - `docs/password.example.txt`

#### Step 1: Access Legacy Solflare

Visit [https://legacy.solflare.com](https://legacy.solflare.com) to access your wallet.

![Solflare Access Wallet Screen](docs/unlock-screen.png)

#### Step 2: Prepare Your Files

Place these files in the project root directory (same folder as `script.js`):

1. **Password file**: Save as `password.txt`
2. **Keystore file**: Save as `solflare-keystore.json`

**Expected file structure:**
```
solflare-wallet-recovery/
├── script.js
├── solflare-keystore.json  ← Your keystore here
├── password.txt            ← Your password here
├── lib/
└── ...
```

> **Note:** You can use different filenames/paths, but you'll need to specify them when prompted or via CLI flags.

### Finding Your Addresses

Once logged into legacy Solflare, you can find:

![Solflare Wallet Dashboard](docs/copy-values.png)

- **Wallet Address**: Found under "Your Address"
- **Stake Account Addresses**: Listed in "Your staking accounts" section

---

## Usage

### Interactive Mode

The default mode guides you through each step with prompts.

**Start the tool:**
```bash
npm start
# or
node script.js
```

**Process flow:**
1. **File Input** - Provide keystore and password file paths
2. **Decryption** - Keystore is decrypted and verified
3. **Connection** - Connect to Solana network
4. **Balance Check** - View your wallet balance
5. **Stake Accounts** - Add stake account addresses
6. **Withdrawals** - Optionally withdraw from stake accounts
7. **Transfer** - Optionally transfer all funds to new wallet

> **Note:** The tool provides detailed logging with color-coded output:
> - `[DEBUG]` (gray) - Diagnostic information
> - `[INFO]` (blue) - General information
> - `[SUCCESS]` (green) - Successful operations
> - `[WARN]` (yellow) - Warnings and partial failures
> - `[ERROR]` (red) - Errors
>
> **Completion Messages:**
> - "RECOVERY COMPLETE!" - All operations succeeded
> - "RECOVERY COMPLETED WITH ERRORS" - Wallet decrypted successfully, but some transfers failed (you may need to transfer manually using the saved keypair)

<details>
<summary><strong>Advanced: CLI Flags (Non-Interactive Mode)</strong></summary>

<br>

For automation or scripting, use CLI flags to provide all options upfront.

**Basic syntax:**
```bash
node script.js [options]
```

#### Available Options

| Flag                                  | Description                                       | Default                               |
| ------------------------------------- | ------------------------------------------------- | ------------------------------------- |
| `-k, --keystore <path>`               | Path to keystore file                             | `solflare-keystore.json`              |
| `-p, --password <text>`               | Password as text (supports env variables)         | -                                     |
| `--password-file <path>`              | Path to password file (alternative to `-p`)       | -                                     |
| `--decrypt-only`                      | Only decrypt keystore, skip blockchain operations | `false`                               |
| `-r, --rpc <url>`                     | Solana RPC URL                                    | `https://api.mainnet-beta.solana.com` |
| `-s, --stake-accounts <addresses...>` | Stake account addresses (space-separated)         | -                                     |
| `-w, --withdraw-to <address>`         | Destination for stake withdrawals                 | Current wallet                        |
| `-t, --transfer-to <address>`         | Final transfer destination                        | -                                     |
| `-y, --yes`                           | Auto-confirm all prompts                          | `false`                               |
| `--no-tips`                           | Hide tips message                                 | -                                     |
| `-V, --version`                       | Show version number                               | -                                     |
| `-h, --help`                          | Display help                                      | -                                     |

#### Examples

**Decrypt-only mode (fast, offline, no RPC connection):**
```bash
# With password as text
node script.js -p "mypassword" --decrypt-only

# With environment variable
node script.js -p "$PASSWORD" --decrypt-only

# With password file
node script.js --password-file password.txt --decrypt-only
```

**Password from environment variable (single-shot mode):**
```bash
export WALLET_PASSWORD="your-password-here"
node script.js -p "$WALLET_PASSWORD"
```

**Custom keystore with environment variable (recommended):**
```bash
export PASSWORD="your-password"
node script.js -k ./my-keystore.json -p "$PASSWORD"
```

**Password from file (traditional method):**
```bash
node script.js -k ./custom-keystore.json --password-file ./my-password.txt
```

**Fully automated recovery:**
```bash
# Multi-line (Unix/Linux/Mac - use backslash)
node script.js \
  -k solflare-keystore.json \
  -p "$PASSWORD" \
  -s StakeAccount1111111111111111111111111111111 StakeAccount2222222222222222222222222222222 \
  -w DestinationWallet111111111111111111111111111 \
  -t FinalWallet11111111111111111111111111111111111 \
  -y --no-tips

# Single-line (works everywhere)
node script.js -k solflare-keystore.json -p "$PASSWORD" -s StakeAccount1111111111111111111111111111111 StakeAccount2222222222222222222222222222222 -w DestinationWallet111111111111111111111111111 -t FinalWallet11111111111111111111111111111111111 -y --no-tips
```

**Display help:**
```bash
node script.js --help
```

</details>

---

## Security

> ⚠️ **CRITICAL: This tool handles sensitive cryptographic material (private keys).**

**Before using with real funds:**
- Review the complete [Security Policy](SECURITY.md)
- Review [automated security audit results](https://github.com/thijmau/solflare-wallet-recovery/actions/workflows/security-audit.yml)
- Run `npm audit` locally and test with small amounts first

---

## Troubleshooting

Having issues? Check these resources:

- [TROUBLESHOOTING](TROUBLESHOOTING.md) - Common problems and solutions
  - Decryption errors
  - Connection issues
  - Transaction failures
  - File format problems

- [FAQ](FAQ.md) - Frequently asked questions

- [GitHub Issues](https://github.com/thijmau/solflare-wallet-recovery/issues) - Report bugs or ask for help

---

## Support & Contributing

### Support This Project

If this tool helped you recover your funds, consider supporting the development:

| Currency           | Address                                        |
| ------------------ | ---------------------------------------------- |
| **Bitcoin (BTC)**  | `bc1qj24nen3z3en5n89eqg3dsh37cgjytmdqjsehq5`   |
| **Ethereum (ETH)** | `0xd4e249a6aeda20e318922ea448992df26d23bc3d`   |
| **Solana (SOL)**   | `9cz2vBNaS9ZKnXzyLM1D7HjF1p9gwH4mYXamDpRg3UWN` |

*Tips appreciated but never required. This tool is free and open source.*

### Contributing

Contributions are welcome!

- For major changes, open an issue first to discuss
- Submit Pull Requests for improvements

### Related Resources

- **Solflare Documentation** - [https://docs.solflare.com/](https://docs.solflare.com/)
- **Solana Documentation** - [https://docs.solana.com/](https://docs.solana.com/)
- **Legacy Solflare Wallet** - [https://legacy.solflare.com](https://legacy.solflare.com)

---

## License

**GPL-3.0 License** - [LICENSE](LICENSE)

---

## Disclaimer

> **NO WARRANTY:** This software is provided "as is", without warranty of any kind. Use at your own risk.

The author is NOT responsible for loss of funds, vulnerabilities in dependencies, or issues with external services. You are responsible for auditing code, verifying transactions, and securing your keys.

---

<div align="center">

**Star this repo if it helped you recover your funds!**

Made by [Thijmen Maus](https://thijmau.dev)

</div>
