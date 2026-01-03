# Solflare Wallet Recovery Tool

> A comprehensive command-line tool for recovering and managing legacy Solflare wallet keystores, including stake account withdrawals and fund transfers.

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Version](https://img.shields.io/badge/version-1.1.0-orange)](package.json)
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
- [Common Use Cases](#common-use-cases)
  - [Scenario 1: Basic Wallet Recovery](#scenario-1-basic-wallet-recovery)
  - [Scenario 2: Staked SOL Recovery](#scenario-2-staked-sol-recovery)
  - [Scenario 3: Complete Migration](#scenario-3-complete-migration)
  - [Scenario 4: Automated Recovery](#scenario-4-automated-recovery)
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
- ✅ Need to recover funds from [legacy.solflare.com](https://legacy.solflare.com)
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

- **Node.js** v14.0.0 or higher ([Download](https://nodejs.org/))
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

Once logged into legacy.solflare.com, you can find:

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

## Common Use Cases

### Scenario 1: Basic Wallet Recovery

**Problem:** You have keystore and password but can't access legacy.solflare.com

**Solution:**
1. Run the tool with your files
2. Check your balance
3. Transfer funds to a new wallet

---

### Scenario 2: Staked SOL Recovery

**Problem:** SOL staked in old accounts that you need to withdraw

**Solution:**
1. Decrypt your keystore
2. Enter stake account addresses
3. Withdraw to your wallet or new address

---

### Scenario 3: Complete Migration

**Problem:** Moving everything to a new wallet

**Solution:**
1. Recover and decrypt keystore
2. Withdraw all stake accounts
3. Transfer total balance to new wallet

---

### Scenario 4: Automated Recovery

**Problem:** Need to script recovery process or batch operations

**Solution:**
1. Prepare all addresses and file paths
2. Use CLI flags for non-interactive execution
3. Integrate into automation tools/scripts

---

## Security

### Important Security Considerations

| ⚠️ Warning | Details |
|-----------|---------|
| **Private Keys** | This tool handles sensitive cryptographic material |
| **Verify Source** | Always verify you're using the official repository |
| **Never Share** | Never share keystore, password, or generated `wallet-keypair.json` |
| **Review Transactions** | Always review transaction details before confirming |
| **Test First** | Consider testing with a small amount first |
| **CLI Auto-Confirm** | When using `-y` flag, be extra careful with addresses |
| **Backup** | Keep backups of keystore and password in secure locations |

### External Dependencies & Third-Party Risks

This tool relies on external dependencies and services that are outside the author's control:

**npm Dependencies:**
- `@solana/web3.js` - Solana blockchain interaction
- `commander` - CLI argument parsing
- `aes-js`, `pbkdf2`, `tweetnacl` - Cryptographic operations
- `bs58`, `picocolors` - Utility functions

**External Services:**
- Solana RPC endpoints (default: `https://api.mainnet-beta.solana.com`)
- GitHub for package distribution
- npm registry for dependency installation

**Important Disclaimers:**

> ⚠️ **Dependency Vulnerabilities:** The author is not responsible for vulnerabilities in third-party dependencies. While efforts are made to use well-maintained packages, you should:
> - Review all dependencies before using this tool with real funds
> - Check for known vulnerabilities using `npm audit`
> - Consider the security posture of each dependency
> - Use at your own risk for any financial operations

> ⚠️ **RPC Endpoint Risks:** When using public RPC endpoints:
> - Your requests may be logged or monitored
> - Service availability is not guaranteed
> - Consider using a private RPC endpoint for sensitive operations
> - Transaction data is transmitted to third-party servers

> ⚠️ **Supply Chain Security:** Before using this tool:
> - Verify you're using the official repository
> - Review the source code yourself
> - Check package signatures and integrity
> - Consider running in an isolated environment for testing

**Automated Security Monitoring:**

This repository includes automated security auditing via GitHub Actions:
- [![Security Audit](https://github.com/thijmau/solflare-wallet-recovery/actions/workflows/security-audit.yml/badge.svg)](https://github.com/thijmau/solflare-wallet-recovery/actions/workflows/security-audit.yml)
- Runs `npm audit` on every push and pull request
- Weekly scheduled scans to detect newly disclosed vulnerabilities
- Check the [Actions tab](https://github.com/thijmau/solflare-wallet-recovery/actions) for detailed audit reports

**Recommendations for Critical Operations:**
1. Review the latest security audit results before use
2. Run `npm audit` locally before using with real funds
3. Audit the code and all dependencies yourself
4. Use a dedicated machine with minimal software installed
5. Use your own trusted/private Solana RPC endpoint for sensitive operations
6. Test with small amounts first
7. Keep this tool and its dependencies updated

---

## Troubleshooting

Having issues? Check these resources:

- 📖 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common problems and solutions
  - Decryption errors
  - Connection issues
  - Transaction failures
  - File format problems

- ❓ [FAQ.md](FAQ.md) - Frequently asked questions

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

- [Solflare Official Documentation](https://docs.solflare.com/)
- [Solana Documentation](https://docs.solana.com/)
- [Legacy Solflare Wallet](https://legacy.solflare.com)

---

## License

**GPL-3.0 License** - See [LICENSE](LICENSE) file for details.

---

## Disclaimer

> **NO WARRANTY:** This software is provided "as is", without warranty of any kind, express or implied. Use at your own risk.

**The author is NOT responsible for:**
- Any loss of funds or assets
- Vulnerabilities in third-party dependencies or services
- Issues arising from external RPC endpoints or blockchain services
- Security breaches in npm packages or supply chain attacks
- Any damages resulting from the use or misuse of this software

**Your Responsibilities:**
- Verify all transactions before confirming them
- Audit the code and dependencies yourself
- Understand the risks of using third-party services
- Keep your keystore and passwords secure
- Use appropriate security measures for your situation

This tool handles sensitive cryptographic material. If you are uncomfortable with any aspect of its operation or dependencies, do not use it with real funds.

---

## Keywords

`solflare-wallet-recovery` `solflare-keystore-decrypt` `legacy-solflare-wallet` `solana-wallet-recovery` `solflare-funds-recovery` `solflare-stake-withdrawal` `solflare-locked-out` `legacy-solflare-recovery` `solana-staking-recovery` `solflare-migration-tool`

---

<div align="center">

**⭐ Star this repo if it helped you recover your funds!**

Made with ❤️ by [Thijmen Maus](https://thijmau.dev)

</div>
