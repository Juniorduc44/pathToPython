# Moralis Wallet Explorer

A lightweight, **browser-based** application that uses the Moralis Web3 Data API to fetch and display the native balance of any EVM wallet (Ethereum, BNB Chain, Polygon, Avalanche, Fantom, Cronos) – all powered by **PyScript**, so the logic runs entirely in Python **inside** your browser.

---

## 1&nbsp;. Project Goals
* Provide a **zero-install** web page for quickly checking wallet balances.  
* Showcase how Python can run in the browser via **PyScript** while consuming the Moralis API.  
* Serve as the foundation for a richer “Web3 Wallet Suite” (transaction history, token/NFT view, transfers, etc.).

---

## 2&nbsp;. Technology Stack
| Layer | Library / Service | Why |
|-------|-------------------|-----|
| UI    | HTML + TailwindCSS + custom CSS | Responsive dark-mode design with teal & gold accents |
| Runtime | PyScript (WebAssembly + Pyodide) | Run pure Python in the browser—no servers required |
| Web3 Data | Moralis Python SDK v0.0.53 | Simple, chain-agnostic endpoints |
| Helpers | `moralis_helpers.py` | Re-usable wrapper around common Moralis calls |
| Build | Static assets only | Can be hosted on IPFS, GitHub Pages, S3, etc. |

---

## 3&nbsp;. Folder Structure
```
/ (branch droid/pyscript-wallet)
│
├─ index.html          # Main web page with embedded PyScript
├─ styles.css          # Theme & component styles
├─ moralis_helpers.py  # Python helpers for Moralis endpoints
├─ documentation.md    # You are here
└─ (future assets)
```

---

## 4&nbsp;. Quick Start

### 4.1 Clone & Launch
```bash
git clone https://github.com/Juniorduc44/pathToPython.git
cd pathToPython
git checkout droid/pyscript-wallet
open index.html        # or double-click the file
```

### 4.2 Using the Application with the Provided API Key
The demo embeds the following Moralis API key in `index.html`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImFhZTUyYzI4LTc3YjMtNGQ4NC1iMTdhLWY5NzE4NmNjMGU5MyIsIm9yZ0lkIjoiMzA0ODYzIiwidXNlcklkIjoiMzEyOTkzIiwidHlwZUlkIjoiMzIwMjdkMDAtYWNhYS00YTFmLTk4NWMtMWQxMzJkZTVmZGQ4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODk1NDI3NDUsImV4cCI6NDg0NTMwMjc0NX0.g-mbcVZbLwTPNJXihBOaJ0WR3wpZTmkTeF8wo-cQQCg
```

1. **No extra configuration is required** – simply load the page and start querying balances.  
2. **Security note:** exposing an unrestricted key client-side is acceptable for demos and educational use only.  
   * In production, proxy calls through a backend or restrict the key’s domain and rate limits in the Moralis dashboard.  
3. To use **your own** key, open `index.html` and replace the `API_KEY` string near the top of the embedded PyScript.

---

## 5&nbsp;. Using `moralis_helpers.py`

The `moralis_helpers.py` module consolidates common Moralis SDK calls into convenient functions.  
It can be imported directly in other PyScript components or traditional Python scripts.

### 5.1 Key Functions
| Function | Purpose |
|----------|---------|
| `get_native_balance(api_key, address, chain="eth")` | Retrieve native balance (ETH/BNB/…) |
| `get_token_balances(api_key, address, chain="eth")` | List ERC-20 token balances |
| `get_wallet_nfts(api_key, address, …)` | Fetch NFTs owned by a wallet |
| `get_cross_chain_balances(api_key, address, chains=[…])` | Convenience helper looping balances across chains |

### 5.2 Example (Standalone Python)
```python
from moralis_helpers import get_native_balance, get_cross_chain_balances

API_KEY = "YOUR_API_KEY"
ADDRESS = "0x26fcbd3afebbe28d0a8684f790c48368d21665b5"

balance = get_native_balance(API_KEY, ADDRESS, chain="eth")
print(balance["formatted_balance"], balance["symbol"])

cc = get_cross_chain_balances(API_KEY, ADDRESS, ["eth", "polygon", "bsc"])
for b in cc["balances"]:
    print(b["chain_name"], b["formatted_balance"], b["symbol"])
```
Every helper returns a **dictionary** ready for JSON encoding or UI display, and catches exceptions to standardise error output.

---

## 6&nbsp;. API Details (Native Balance Endpoint)

`evm_api.balance.get_native_balance`

```python
from moralis import evm_api

params = {"address": "0x1a2b…", "chain": "eth"}
result = evm_api.balance.get_native_balance(api_key=API_KEY, params=params)
# ➜ {'balance': '319973658297093018740'}
```

| Param   | Required | Description                                |
|---------|----------|--------------------------------------------|
| address | ✓        | Wallet to inspect                          |
| chain   | ✓        | `eth`, `bsc`, `polygon`, `avalanche`, …    |

---

## 7&nbsp;. Using the Web App

1. Enter the **wallet address** (EVM format, e.g. `0x…`).  
2. Choose a **blockchain**.  
3. Click **“Check Balance”** – the native balance appears along with its ticker (ETH, BNB, …).  

A loading spinner indicates the request is in flight. Errors from Moralis (invalid address, rate limit) are displayed in red.

---

## 8&nbsp;. Extensibility Roadmap

| Phase | Planned Feature | Moralis Endpoint |
|-------|-----------------|------------------|
| 1 ✅ | Native balance lookup | `balance.get_native_balance` |
| 2 | ERC-20 token balances | `token.get_wallet_token_balances` |
| 3 | NFT gallery          | `nft.get_wallet_nfts` |
| 4 | Transaction history  | `transaction.get_wallet_transactions` |
| 5 | Cross-chain overview | Helper loops across chains |

---

## 9&nbsp;. Troubleshooting

| Issue | Fix |
|-------|-----|
| “No module named moralis” in console | Check PyScript `packages` list & network connectivity |
| CORS / 403 errors | Verify API key validity / limits |
| Balance shows `0` but wallet has funds | Ensure correct chain is selected |

---

## 10&nbsp;. License
MIT — see `LICENSE` (to be added).

---

**Happy hacking & may all your balances be green!**
