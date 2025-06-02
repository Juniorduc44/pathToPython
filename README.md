# Moralis Wallet Explorer

A **single-page, zero-backend** web application that lets you fetch and display the native balance of any EVM wallet (Ethereum, BNB Chain, Polygon, Avalanche, Fantom, Cronos) directly in your browser.  
Built with **PyScript** (Python running in WebAssembly) and the **Moralis Web3 Data API**.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔗 Multi-Chain Support | Choose from six major EVM networks via a dropdown. |
| ⚡ Runs Fully in the Browser | No server or build pipeline; open `index.html` and go. |
| 🐍 Python-Powered | Logic written in Python thanks to PyScript & Pyodide. |
| 🎨 Dark UI | Modern, responsive interface with a cohesive teal / gold palette. |
| 📈 Extensible | Foundation for token balances, NFTs, and tx history (see roadmap). |

---

## 🚀 Quick Start

1. **Clone & switch to the wallet branch**

   ```bash
   git clone https://github.com/Juniorduc44/pathToPython.git
   cd pathToPython
   git checkout droid/pyscript-wallet
   ```

2. **Open the app**

   Double-click `index.html` (or run `open index.html` / `start index.html`).  
   The page loads locally—no internet except for fetching PyScript & Moralis.

3. **Check a balance**

   • Paste a wallet address (0x…)  
   • Select a chain  
   • Click **Check Balance** → balance appears instantly.

---

## 🔑 API Key Configuration

The demo embeds a Moralis API key in `index.html`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

For production:

1. Replace the placeholder key with **your own** in `index.html` near the top of the embedded PyScript.
2. Restrict the key (domain, rate limits) in the Moralis dashboard **or** proxy requests through a minimal backend to keep the key secret.

---

## 🧑‍💻 Local Development

| Task | Command / Action |
|------|------------------|
| Modify styles | Edit `styles.css` (pure CSS). |
| Tweak logic  | Update the embedded `<py-script>` in `index.html` or extend helpers in `moralis_helpers.py`. |
| Install Python deps for helpers | `pip install moralis` (only if running helpers outside the browser). |

Changes are visible on browser refresh—no build step needed.

---

## 🛣️ Roadmap

| Phase | Planned Feature | Moralis Endpoint |
|-------|-----------------|------------------|
| 1 ✅ | Native balance lookup | `balance.get_native_balance` |
| 2 | ERC-20 token balances | `token.get_wallet_token_balances` |
| 3 | NFT gallery | `nft.get_wallet_nfts` |
| 4 | Transaction history | `transaction.get_wallet_transactions` |
| 5 | Cross-chain dashboard | Aggregate endpoints across networks |

---

## 🏗️ Tech Stack

| Layer | Library / Service |
|-------|-------------------|
| Front-end | HTML, TailwindCSS, custom CSS |
| Runtime  | PyScript · Pyodide |
| Web3 Data | Moralis Web3 Data API v0.0.53 |

---

## ⚖️ License

MIT – see `LICENSE` for details.
