# Solflare Wallet Recovery Tool

> A comprehensive command-line tool for recovering and managing legacy Solflare wallet keystores, including stake account withdrawals and fund transfers.

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Version](https://img.shields.io/badge/version-1.1.1-orange)](package.json)
[![Security Audit](https://github.com/thijmau/solflare-wallet-recovery/actions/workflows/security-audit.yml/badge.svg)](https://github.com/thijmau/solflare-wallet-recovery/actions/workflows/security-audit.yml)

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup](#setup)
  - [Getting Your Keystore and Password](#getting-your-keystore-and-password)
  - [Finding Your Addresses](#finding-your-addresses)
- [Usage](#usage)
  - [Interactive Mode](#interactive-mode)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Support & Contributing](#support--contributing)
  - [Support This Project](#support-this-project)
  - [Contributing](#contributing)
  - [Related Resources](#related-resources)
- [License](#license)
- [Disclaimer](#disclaimer)

---

## Overview

### Can't Access Your Legacy Solflare Wallet?

This tool solves common problems with legacy Solflare wallets:

- ✅ Locked out of legacy Solflare wallet
- ✅ Can't access Solflare keystore file
- ✅ Need to recover funds from [https://legacy.solflare.com](https://legacy.solflare.com)
- ✅ Unable to withdraw staked SOL from old accounts
- ✅ Migrating from legacy Solflare to modern wallet

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/thijmau/solflare-wallet-recovery.git
cd solflare-wallet-recovery
npm install

# 2. Place your files in the project root
# - solflare-keystore.json
# - password.txt

# 3. Run the tool
npm start
```

---

## Features

This tool provides a complete recovery and retrieval solution:

| Feature | Description |
|---------|-------------|
| 🔐 **Keystore Decryption** | Decrypt legacy Solflare keystore files using your password |
| 💰 **Balance Checking** | View wallet and stake account balances |
| 💸 **Stake Withdrawal** | Unstake and withdraw SOL from multiple stake accounts |
| 🔄 **Fund Transfer** | Transfer recovered funds to a new wallet |
| 🤖 **CLI Automation** | Scriptable with command-line flags for batch recovery |
| 📝 **Interactive Mode** | Step-by-step guided recovery process |

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** v14.0.0 or higher - [https://nodejs.org/](https://nodejs.org/)
- **Solflare keystore file** (`.json` format)
- **Wallet password** (saved in a text file)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/thijmau/solflare-wallet-recovery.git
cd solflare-wallet-recovery

# Install dependencies
npm install
```

---

## Setup

### Getting Your Keystore and Password

> 💡 **Example files available:** Check `docs/` directory for sample file formats
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

> 📝 **Note:** You can use different filenames/paths, but you'll need to specify them when prompted or via CLI flags.

### Finding Your Addresses

Once logged into [https://legacy.solflare.com](https://legacy.solflare.com), you can find:

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
1. ✅ **File Input** - Provide keystore and password file paths
2. ✅ **Decryption** - Keystore is decrypted and verified
3. ✅ **Connection** - Connect to Solana network
4. ✅ **Balance Check** - View your wallet balance
5. ✅ **Stake Accounts** - Add stake account addresses
6. ✅ **Withdrawals** - Optionally withdraw from stake accounts
7. ✅ **Transfer** - Optionally transfer all funds to new wallet

<details>
<summary><strong>Advanced: CLI Flags (Non-Interactive Mode)</strong></summary>

<br>

For automation or scripting, use CLI flags to provide all options upfront.

**Basic syntax:**
```bash
node script.js [options]
```

#### Available Options

| Flag | Description | Default |
|------|-------------|---------|
| `-k, --keystore <path>` | Path to keystore file | `solflare-keystore.json` |
| `-p, --password <path>` | Path to password file | `password.txt` |
| `-r, --rpc <url>` | Solana RPC URL | `https://api.mainnet-beta.solana.com` |
| `-s, --stake-accounts <addresses...>` | Stake account addresses (space-separated) | - |
| `-w, --withdraw-to <address>` | Destination for stake withdrawals | Current wallet |
| `-t, --transfer-to <address>` | Final transfer destination | - |
| `-y, --yes` | Auto-confirm all prompts | `false` |
| `--no-tips` | Hide tips message | - |
| `-V, --version` | Show version number | - |
| `-h, --help` | Display help | - |

#### Examples

**Custom file paths:**
```bash
node script.js -k ./my-keystore.json -p ./my-password.txt
```

**Fully automated recovery:**
```bash
node script.js \
  -k solflare-keystore.json \
  -p password.txt \
  -r https://api.mainnet-beta.solana.com \
  -s StakeAccount1111111111111111111111111111111 StakeAccount2222222222222222222222222222222 \
  -w DestinationWallet111111111111111111111111111 \
  -t FinalWallet11111111111111111111111111111111111 \
  -y \
  --no-tips
```

**Check balance only:**
```bash
node script.js -k keystore.json -p password.txt
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
- Read the complete [Security Policy](SECURITY.md)
- Review [automated security audit results](https://github.com/thijmau/solflare-wallet-recovery/actions/workflows/security-audit.yml)
- Understand the risks of external dependencies and RPC endpoints
- Test with small amounts first

**Quick Security Checklist:**
- ✅ Verify you're using the official repository
- ✅ Run `npm audit` locally before use
- ✅ Never share your keystore or password
- ✅ Review all transaction addresses before confirming
- ✅ Keep backups in secure locations

**For comprehensive security information, dependency risks, and best practices, see [SECURITY](SECURITY.md)**

---

## Troubleshooting

Having issues? Check these resources:

- 📖 [TROUBLESHOOTING](TROUBLESHOOTING.md) - Common problems and solutions
  - Decryption errors
  - Connection issues
  - Transaction failures
  - File format problems

- ❓ [FAQ](FAQ.md) - Frequently asked questions

- 🐛 [GitHub Issues](https://github.com/thijmau/solflare-wallet-recovery/issues) - Report bugs or ask for help

> **⚠️ Security Reminder:** Never share private keys or keystore files when seeking help!

---

## Support & Contributing

### Support This Project

If this tool helped you recover your funds, consider supporting the development:

| Currency | Address |
|----------|---------|
| **Bitcoin (BTC)** | `bc1qj24nen3z3en5n89eqg3dsh37cgjytmdqjsehq5` |
| **Ethereum (ETH)** | `0xd4e249a6aeda20e318922ea448992df26d23bc3d` |
| **Solana (SOL)** | `9cz2vBNaS9ZKnXzyLM1D7HjF1p9gwH4mYXamDpRg3UWN` |

*Tips appreciated but never required. This tool is free and open source.*

### Contributing

Contributions are welcome!

- For major changes, open an issue first to discuss
- Submit Pull Requests for improvements
- Report bugs via [GitHub Issues](https://github.com/thijmau/solflare-wallet-recovery/issues)

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

**For detailed disclaimers and security considerations, see [SECURITY](SECURITY.md)**

---

## Keywords

`solflare-wallet-recovery` `solflare-keystore-decrypt` `legacy-solflare-wallet` `solana-wallet-recovery` `solflare-funds-recovery` `solflare-stake-withdrawal` `solflare-locked-out` `legacy-solflare-recovery` `solana-staking-recovery` `solflare-migration-tool`

---

<div align="center">

**⭐ Star this repo if it helped you recover your funds!**

Made with ❤️ by [Thijmen Maus](https://thijmau.dev)

</div>
