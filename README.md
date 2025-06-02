# Moralis Wallet Balance Checker

A lightweight, **browser-based** tool that uses the Moralis Web3 Data API to fetch and display the native balance of any EVM wallet (Ethereum, BNB Chain, Polygon, Avalanche, Fantom, Cronos) – all powered by **PyScript**, so the logic runs entirely in Python **inside** your browser.

## Features
- Zero-install: open a single HTML file, no backend required  
- Supports six major EVM chains (dropdown selector)  
- Responsive UI styled with TailwindCSS, colour palette inspired by the PyScript “Python Quest” demo  
- Built for extension: token balances, NFTs, tx history can be added later

## Quick Start

1. **Clone the repo and switch to the wallet branch**

   ```bash
   git clone https://github.com/Juniorduc44/pathToPython.git
   cd pathToPython
   git checkout droid/pyscript-wallet
   ```

2. **Open `index.html` in your browser**  
   (double-click the file or `open index.html` on mac / `start index.html` on Windows).

3. **Enter a wallet address**, pick a chain, and click **Check Balance**.

> **API Key**  
> The demo embeds a Moralis API key directly in `index.html`.  
> For production use, secure your key via a backend or set domain/usage limits in the Moralis dashboard.

## Requirements
- Modern browser with WebAssembly enabled (Chrome, Edge, Firefox, Safari).

## Roadmap
| Phase | Planned addition |
|-------|------------------|
| 2     | ERC-20 token balances |
| 3     | NFT holdings |
| 4     | Transaction history & cross-chain overview |

---

MIT License – see `LICENSE` (to be added).
