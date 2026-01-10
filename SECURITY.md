# Security Policy

## Overview

This document outlines the security considerations, automated monitoring, and responsible disclosure practices for the Solflare Wallet Recovery Tool.

---

## Reporting a Vulnerability

If you discover a security vulnerability, please **DO NOT** open a public issue.

Use GitHub's private vulnerability reporting feature to report security issues responsibly:

**Report a vulnerability:** [https://github.com/thijmau/solflare-wallet-recovery/security/advisories/new](https://github.com/thijmau/solflare-wallet-recovery/security/advisories/new)

When reporting:
- Include detailed steps to reproduce the vulnerability
- Provide the version affected
- Describe the potential impact

---

## Automated Security Monitoring

[![Security Audit](https://github.com/thijmau/solflare-wallet-recovery/actions/workflows/security-audit.yml/badge.svg)](https://github.com/thijmau/solflare-wallet-recovery/actions/workflows/security-audit.yml)

This repository includes automated security auditing via GitHub Actions:

- **Continuous Monitoring**: Runs `npm audit` on every push and pull request
- **Weekly Scans**: Scheduled scans every Monday at 00:00 UTC to detect newly disclosed vulnerabilities
- **Build Protection**: Pull requests fail if moderate or higher vulnerabilities are detected
- **Detailed Reports**: Check the [Actions tab](https://github.com/thijmau/solflare-wallet-recovery/actions) for comprehensive audit reports

---

## Security Considerations

### Important Warnings

| Warning | Details |
|---------|---------|
| **Private Keys** | This tool handles sensitive cryptographic material |
| **Verify Source** | Always verify you're using the official repository |
| **Never Share** | Never share keystore, password, or generated `wallet-keypair.json` |
| **Review Transactions** | Always review transaction details before confirming |
| **Test First** | Consider testing with a small amount first |
| **CLI Auto-Confirm** | When using `-y` flag, be extra careful with addresses |
| **Backup** | Keep backups of keystore and password in secure locations |

---

## External Dependencies & Third-Party Risks

This tool relies on external dependencies and services that are **outside the author's control**.

### npm Dependencies

| Package | Purpose | Risk Level |
|---------|---------|------------|
| `@solana/web3.js` | Solana blockchain interaction | Critical |
| `commander` | CLI argument parsing | Low |
| `aes-js` | AES encryption operations | Critical |
| `pbkdf2` | Key derivation | Critical |
| `tweetnacl` | Cryptographic operations | Critical |
| `bs58` | Base58 encoding/decoding | Medium |
| `picocolors` | Terminal colors | Low |

### External Services

- **Solana RPC Endpoints** (default: `https://api.mainnet-beta.solana.com`)
  - Your requests may be logged or monitored
  - Service availability is not guaranteed
  - Transaction data is transmitted to third-party servers

- **GitHub** - Package distribution and updates
- **npm Registry** - Dependency installation

---

## Important Disclaimers

### Dependency Vulnerabilities

> ⚠️ **The author is NOT responsible for vulnerabilities in third-party dependencies.**

While efforts are made to use well-maintained packages, you should:
- Review all dependencies before using this tool with real funds
- Check for known vulnerabilities using `npm audit`
- Consider the security posture of each dependency
- Use at your own risk for any financial operations

### RPC Endpoint Risks

> ⚠️ **When using public RPC endpoints:**

- Your requests may be logged or monitored by the RPC provider
- Service availability is not guaranteed
- Consider using a private RPC endpoint for sensitive operations
- Transaction data is transmitted to third-party servers
- The RPC provider could theoretically intercept or log your data

### Supply Chain Security

> ⚠️ **Before using this tool:**

- Verify you're using the official repository: `https://github.com/thijmau/solflare-wallet-recovery`
- Review the source code yourself
- Check package signatures and integrity
- Consider running in an isolated environment for testing
- Be aware of potential supply chain attacks through dependencies

---

## Recommendations for Critical Operations

Before using this tool with significant funds:

1. **Review Security Status**
   - Check the [latest security audit results](https://github.com/thijmau/solflare-wallet-recovery/actions)
   - Run `npm audit` locally before use

2. **Code Review**
   - Audit the source code yourself
   - Review all dependencies and their purposes
   - Verify package checksums

3. **Environment Security**
   - Use a dedicated machine with minimal software installed
   - Avoid running other applications during recovery
   - Ensure your system is updated and free of malware

4. **Network Security**
   - Use your own trusted/private Solana RPC endpoint for sensitive operations
   - Consider using a VPN for additional privacy
   - Be aware that RPC requests are not encrypted end-to-end

5. **Operational Security**
   - Test with small amounts first
   - Review all addresses carefully before confirming
   - Keep this tool and its dependencies updated

6. **Backup Strategy**
   - Keep multiple secure backups of your keystore
   - Store passwords separately from keystores
   - Consider using a password manager

---

## What This Tool Does NOT Do

This tool:
- **Does NOT** send your private keys anywhere
- **Does NOT** contact any external services except the Solana RPC endpoint you specify
- **Does NOT** log or store your sensitive information
- **Does NOT** manage or restake funds (it's purely for recovery/retrieval)

---

## Disclaimer

> **NO WARRANTY:** This software is provided "as is", without warranty of any kind, express or implied.

**The author is NOT responsible for:**
- Loss of funds, vulnerabilities in dependencies, or issues with external services
- Security breaches in npm packages or supply chain attacks
- Any damages resulting from use or misuse of this software

**Your Responsibilities:**
- Audit the code and dependencies yourself before use
- Understand the risks of third-party services and verify all transactions

**This tool handles sensitive cryptographic material. If you are uncomfortable with any aspect of its operation or dependencies, do not use it with real funds.**
