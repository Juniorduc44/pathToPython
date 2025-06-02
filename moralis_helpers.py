"""
Moralis Wallet Helper Functions

A collection of utility functions for interacting with the Moralis Web3 Data API.
These functions wrap the Moralis Python SDK to make common operations easier.

Usage:
    from moralis_helpers import get_native_balance, get_token_balances, get_wallet_nfts

Requirements:
    pip install moralis
"""

import json
from typing import Dict, List, Optional, Union, Any
from moralis import evm_api, sol_api
from moralis.utils import web3_api_version

# Constants
CHAIN_SYMBOLS = {
    "eth": "ETH",
    "bsc": "BNB",
    "polygon": "MATIC",
    "avalanche": "AVAX",
    "fantom": "FTM",
    "cronos": "CRO",
    "arbitrum": "ETH",
    "optimism": "ETH",
    "palm": "PALM",
    "mumbai": "MATIC"
}

CHAIN_NAMES = {
    "eth": "Ethereum",
    "bsc": "Binance Smart Chain",
    "polygon": "Polygon",
    "avalanche": "Avalanche",
    "fantom": "Fantom",
    "cronos": "Cronos",
    "arbitrum": "Arbitrum",
    "optimism": "Optimism",
    "palm": "Palm",
    "mumbai": "Mumbai Testnet"
}

DECIMALS = {
    "eth": 18,
    "bsc": 18,
    "polygon": 18,
    "avalanche": 18,
    "fantom": 18,
    "cronos": 18,
    "arbitrum": 18,
    "optimism": 18,
    "palm": 18,
    "mumbai": 18
}

def get_api_version(api_key: str) -> Dict[str, str]:
    """
    Get the current Moralis Web3 API version.
    
    Args:
        api_key: Your Moralis API key
        
    Returns:
        Dict with version information
        
    Example:
        >>> get_api_version("YOUR_API_KEY")
        {'version': '0.0.53'}
    """
    return web3_api_version(api_key=api_key)

def format_balance(balance_wei: str, decimals: int = 18) -> str:
    """
    Format a balance from wei to a human-readable format.
    
    Args:
        balance_wei: Balance in wei as a string
        decimals: Number of decimals (default: 18 for most EVM chains)
        
    Returns:
        Formatted balance string
    """
    balance = int(balance_wei) / (10 ** decimals)
    if balance < 0.000001 and balance > 0:
        return f"{balance:.8f}"
    return f"{balance:.6f}"

def get_native_balance(api_key: str, address: str, chain: str = "eth") -> Dict[str, Any]:
    """
    Get the native balance of an address on a specific chain.
    
    Args:
        api_key: Your Moralis API key
        address: The wallet address to check
        chain: The blockchain to query (default: eth)
        
    Returns:
        Dict with balance information including formatted balance
        
    Example:
        >>> get_native_balance("YOUR_API_KEY", "0x26fcbd3afebbe28d0a8684f790c48368d21665b5")
        {
            'raw_balance': '319973658297093018740',
            'formatted_balance': '319.973658',
            'symbol': 'ETH',
            'chain': 'eth',
            'chain_name': 'Ethereum'
        }
    """
    params = {
        "address": address,
        "chain": chain,
    }
    
    try:
        result = evm_api.balance.get_native_balance(
            api_key=api_key,
            params=params,
        )
        
        # Format the balance for display
        decimals = DECIMALS.get(chain, 18)
        formatted_balance = format_balance(result['balance'], decimals)
        
        # Add additional useful information
        result['formatted_balance'] = formatted_balance
        result['symbol'] = CHAIN_SYMBOLS.get(chain, "")
        result['chain'] = chain
        result['chain_name'] = CHAIN_NAMES.get(chain, chain)
        result['raw_balance'] = result.pop('balance')  # Rename 'balance' to 'raw_balance'
        
        return result
    except Exception as e:
        return {
            'error': str(e),
            'chain': chain,
            'address': address
        }

def get_token_balances(
    api_key: str, 
    address: str, 
    chain: str = "eth", 
    token_addresses: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Get all ERC20 token balances for an address.
    
    Args:
        api_key: Your Moralis API key
        address: The wallet address to check
        chain: The blockchain to query (default: eth)
        token_addresses: Optional list of specific token addresses to check
        
    Returns:
        Dict with token balances information
        
    Example:
        >>> get_token_balances("YOUR_API_KEY", "0x26fcbd3afebbe28d0a8684f790c48368d21665b5")
        {
            'tokens': [
                {
                    'token_address': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                    'name': 'USD Coin',
                    'symbol': 'USDC',
                    'logo': null,
                    'thumbnail': null,
                    'decimals': 6,
                    'balance': '1000000',
                    'formatted_balance': '1.000000',
                    'possible_spam': false
                },
                ...
            ],
            'chain': 'eth',
            'chain_name': 'Ethereum',
            'address': '0x26fcbd3afebbe28d0a8684f790c48368d21665b5'
        }
    """
    params = {
        "address": address,
        "chain": chain,
    }
    
    if token_addresses:
        params["token_addresses"] = token_addresses
    
    try:
        result = evm_api.token.get_wallet_token_balances(
            api_key=api_key,
            params=params,
        )
        
        # Format balances for each token
        for token in result:
            if 'decimals' in token and token['decimals'] is not None:
                token['formatted_balance'] = format_balance(token['balance'], int(token['decimals']))
            else:
                token['formatted_balance'] = token['balance']
        
        # Return a more structured response
        return {
            'tokens': result,
            'chain': chain,
            'chain_name': CHAIN_NAMES.get(chain, chain),
            'address': address
        }
    except Exception as e:
        return {
            'error': str(e),
            'chain': chain,
            'address': address,
            'tokens': []
        }

def get_wallet_nfts(
    api_key: str, 
    address: str, 
    chain: str = "eth", 
    limit: int = 100,
    cursor: str = "",
    format: str = "decimal",
    normalize_metadata: bool = True,
    token_addresses: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Get all NFTs owned by an address.
    
    Args:
        api_key: Your Moralis API key
        address: The wallet address to check
        chain: The blockchain to query (default: eth)
        limit: Number of NFTs to return (default: 100, max: 100)
        cursor: Cursor for pagination
        format: Format for token_id (decimal or hex)
        normalize_metadata: Whether to normalize metadata
        token_addresses: Optional list of specific NFT contract addresses
        
    Returns:
        Dict with NFT information
        
    Example:
        >>> get_wallet_nfts("YOUR_API_KEY", "0x26fcbd3afebbe28d0a8684f790c48368d21665b5")
        {
            'total': 2,
            'page': 0,
            'page_size': 100,
            'cursor': '...',
            'result': [
                {
                    'token_address': '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
                    'token_id': '3931',
                    'amount': '1',
                    'owner_of': '0x1cf2b8c64aed32bff2ae80e701681316d3212afd',
                    'token_hash': '3c86855c82470edd82df190019e83f16',
                    'block_number_minted': '5754322',
                    'block_number': '13868997',
                    'contract_type': null,
                    'name': 'CRYPTOPUNKS',
                    'symbol': 'Ͼ',
                    'token_uri': 'https://www.larvalabs.com/cryptopunks/details/3931',
                    'metadata': '...',
                    'normalized_metadata': {
                        'name': 'CryptoPunk 3931',
                        'description': 'Male',
                        'image': '...',
                        'attributes': [...]
                    }
                },
                ...
            ],
            'status': 'SYNCED',
            'chain': 'eth',
            'chain_name': 'Ethereum',
            'address': '0x26fcbd3afebbe28d0a8684f790c48368d21665b5'
        }
    """
    params = {
        "address": address,
        "chain": chain,
        "format": format,
        "limit": limit,
        "cursor": cursor,
        "normalizeMetadata": normalize_metadata
    }
    
    if token_addresses:
        params["token_addresses"] = token_addresses
    
    try:
        result = evm_api.nft.get_wallet_nfts(
            api_key=api_key,
            params=params,
        )
        
        # Add chain information to the result
        result['chain'] = chain
        result['chain_name'] = CHAIN_NAMES.get(chain, chain)
        result['address'] = address
        
        return result
    except Exception as e:
        return {
            'error': str(e),
            'chain': chain,
            'address': address,
            'result': []
        }

def get_nft_metadata(
    api_key: str,
    address: str,
    token_id: str,
    chain: str = "eth",
    format: str = "decimal",
    normalize_metadata: bool = True
) -> Dict[str, Any]:
    """
    Get metadata for a specific NFT.
    
    Args:
        api_key: Your Moralis API key
        address: The NFT contract address
        token_id: The token ID of the NFT
        chain: The blockchain to query (default: eth)
        format: Format for token_id (decimal or hex)
        normalize_metadata: Whether to normalize metadata
        
    Returns:
        Dict with NFT metadata
        
    Example:
        >>> get_nft_metadata("YOUR_API_KEY", "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB", "3931")
        {
            'token_address': '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
            'token_id': '3931',
            'amount': '1',
            'owner_of': '0x1cf2b8c64aed32bff2ae80e701681316d3212afd',
            'token_hash': '3c86855c82470edd82df190019e83f16',
            'block_number_minted': '5754322',
            'block_number': '13868997',
            'contract_type': null,
            'name': 'CRYPTOPUNKS',
            'symbol': 'Ͼ',
            'token_uri': 'https://www.larvalabs.com/cryptopunks/details/3931',
            'metadata': '...',
            'normalized_metadata': {
                'name': 'CryptoPunk 3931',
                'description': 'Male',
                'image': '...',
                'attributes': [...]
            },
            'chain': 'eth',
            'chain_name': 'Ethereum'
        }
    """
    params = {
        "address": address,
        "token_id": token_id,
        "chain": chain,
        "format": format,
        "normalizeMetadata": normalize_metadata
    }
    
    try:
        result = evm_api.nft.get_nft_metadata(
            api_key=api_key,
            params=params,
        )
        
        # Add chain information to the result
        result['chain'] = chain
        result['chain_name'] = CHAIN_NAMES.get(chain, chain)
        
        return result
    except Exception as e:
        return {
            'error': str(e),
            'chain': chain,
            'address': address,
            'token_id': token_id
        }

def get_nft_owners(
    api_key: str,
    address: str,
    chain: str = "eth",
    format: str = "decimal",
    limit: int = 100,
    cursor: str = "",
    normalize_metadata: bool = True
) -> Dict[str, Any]:
    """
    Get all owners of NFTs in a contract.
    
    Args:
        api_key: Your Moralis API key
        address: The NFT contract address
        chain: The blockchain to query (default: eth)
        format: Format for token_id (decimal or hex)
        limit: Number of results to return (default: 100, max: 100)
        cursor: Cursor for pagination
        normalize_metadata: Whether to normalize metadata
        
    Returns:
        Dict with NFT owners information
        
    Example:
        >>> get_nft_owners("YOUR_API_KEY", "0xd4e4078ca3495DE5B1d4dB434BEbc5a986197782")
        {
            'total': 100,
            'page': 0,
            'page_size': 100,
            'cursor': '...',
            'result': [
                {
                    'token_address': '0xd4e4078ca3495de5b1d4db434bebc5a986197782',
                    'token_id': '1',
                    'amount': '1',
                    'owner_of': '0x6c3e4cb2e96b01f4b866965a91ed4437839a121a',
                    'token_hash': '...',
                    'block_number': '12921700',
                    'block_number_minted': '12921700',
                    'contract_type': 'ERC721',
                    'name': 'Hashmasks',
                    'symbol': 'HM',
                    'token_uri': '...',
                    'metadata': '...',
                    'normalized_metadata': {...}
                },
                ...
            ],
            'status': 'SYNCED',
            'chain': 'eth',
            'chain_name': 'Ethereum',
            'contract_address': '0xd4e4078ca3495DE5B1d4dB434BEbc5a986197782'
        }
    """
    params = {
        "address": address,
        "chain": chain,
        "format": format,
        "limit": limit,
        "cursor": cursor,
        "normalizeMetadata": normalize_metadata
    }
    
    try:
        result = evm_api.nft.get_nft_owners(
            api_key=api_key,
            params=params,
        )
        
        # Add chain information to the result
        result['chain'] = chain
        result['chain_name'] = CHAIN_NAMES.get(chain, chain)
        result['contract_address'] = address
        
        return result
    except Exception as e:
        return {
            'error': str(e),
            'chain': chain,
            'contract_address': address,
            'result': []
        }

def get_wallet_transactions(
    api_key: str,
    address: str,
    chain: str = "eth",
    limit: int = 100,
    cursor: str = "",
    include_internal: bool = False
) -> Dict[str, Any]:
    """
    Get all transactions for a wallet address.
    
    Args:
        api_key: Your Moralis API key
        address: The wallet address
        chain: The blockchain to query (default: eth)
        limit: Number of results to return (default: 100, max: 100)
        cursor: Cursor for pagination
        include_internal: Whether to include internal transactions
        
    Returns:
        Dict with transaction information
        
    Example:
        >>> get_wallet_transactions("YOUR_API_KEY", "0x26fcbd3afebbe28d0a8684f790c48368d21665b5")
        {
            'total': 100,
            'page': 0,
            'page_size': 100,
            'cursor': '...',
            'result': [
                {
                    'hash': '0x...',
                    'nonce': '123',
                    'transaction_index': '10',
                    'from_address': '0x26fcbd3afebbe28d0a8684f790c48368d21665b5',
                    'to_address': '0x...',
                    'value': '1000000000000000000',
                    'gas': '21000',
                    'gas_price': '30000000000',
                    'input': '0x',
                    'receipt_cumulative_gas_used': '1500000',
                    'receipt_gas_used': '21000',
                    'receipt_contract_address': null,
                    'receipt_root': '0x...',
                    'receipt_status': '1',
                    'block_timestamp': '2021-06-04T16:00:15.000Z',
                    'block_number': '12614994',
                    'block_hash': '0x...',
                    'transfer_index': [12614994, 10]
                },
                ...
            ],
            'chain': 'eth',
            'chain_name': 'Ethereum',
            'address': '0x26fcbd3afebbe28d0a8684f790c48368d21665b5'
        }
    """
    params = {
        "address": address,
        "chain": chain,
        "limit": limit,
        "cursor": cursor,
        "include_internal": include_internal
    }
    
    try:
        result = evm_api.transaction.get_wallet_transactions(
            api_key=api_key,
            params=params,
        )
        
        # Add chain information to the result
        result['chain'] = chain
        result['chain_name'] = CHAIN_NAMES.get(chain, chain)
        result['address'] = address
        
        return result
    except Exception as e:
        return {
            'error': str(e),
            'chain': chain,
            'address': address,
            'result': []
        }

def get_wallet_nft_collections(
    api_key: str,
    address: str,
    chain: str = "eth",
    limit: int = 100,
    cursor: str = ""
) -> Dict[str, Any]:
    """
    Get all NFT collections owned by an address.
    
    Args:
        api_key: Your Moralis API key
        address: The wallet address
        chain: The blockchain to query (default: eth)
        limit: Number of results to return (default: 100, max: 100)
        cursor: Cursor for pagination
        
    Returns:
        Dict with NFT collections information
        
    Example:
        >>> get_wallet_nft_collections("YOUR_API_KEY", "0x26fcbd3afebbe28d0a8684f790c48368d21665b5")
        {
            'total': 5,
            'page': 0,
            'page_size': 100,
            'cursor': null,
            'result': [
                {
                    'token_address': '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
                    'contract_type': 'ERC721',
                    'name': 'CryptoPunks',
                    'symbol': 'PUNK',
                    'media': {...},
                    'verified_collection': true,
                    'spam_info': {...},
                    'possible_spam': false,
                    'verified': true
                },
                ...
            ],
            'chain': 'eth',
            'chain_name': 'Ethereum',
            'address': '0x26fcbd3afebbe28d0a8684f790c48368d21665b5'
        }
    """
    params = {
        "address": address,
        "chain": chain,
        "limit": limit,
        "cursor": cursor
    }
    
    try:
        result = evm_api.nft.get_wallet_nft_collections(
            api_key=api_key,
            params=params,
        )
        
        # Add chain information to the result
        result['chain'] = chain
        result['chain_name'] = CHAIN_NAMES.get(chain, chain)
        result['address'] = address
        
        return result
    except Exception as e:
        return {
            'error': str(e),
            'chain': chain,
            'address': address,
            'result': []
        }

def get_sol_balance(api_key: str, address: str, network: str = "mainnet") -> Dict[str, Any]:
    """
    Get the native SOL balance of a Solana address.
    
    Args:
        api_key: Your Moralis API key
        address: The Solana wallet address
        network: The Solana network (mainnet or devnet)
        
    Returns:
        Dict with balance information
        
    Example:
        >>> get_sol_balance("YOUR_API_KEY", "BWeBmN8zYDXgx2tnGj72cA533GZEWAVeqR9Eu29txaen")
        {
            'lamports': '0',
            'solana': '0',
            'formatted_balance': '0.000000',
            'network': 'mainnet',
            'address': 'BWeBmN8zYDXgx2tnGj72cA533GZEWAVeqR9Eu29txaen'
        }
    """
    params = {
        "address": address,
        "network": network,
    }
    
    try:
        result = sol_api.account.balance(
            api_key=api_key,
            params=params,
        )
        
        # Format the balance for display (1 SOL = 1,000,000,000 lamports)
        sol_balance = int(result['lamports']) / 1_000_000_000
        result['formatted_balance'] = f"{sol_balance:.6f}"
        
        # Add network and address information to the result
        result['network'] = network
        result['address'] = address
        
        return result
    except Exception as e:
        return {
            'error': str(e),
            'network': network,
            'address': address
        }

def get_cross_chain_balances(
    api_key: str, 
    address: str, 
    chains: List[str] = ["eth", "bsc", "polygon", "avalanche"]
) -> Dict[str, Any]:
    """
    Get native balances across multiple chains for an address.
    
    Args:
        api_key: Your Moralis API key
        address: The wallet address
        chains: List of chains to query (default: eth, bsc, polygon, avalanche)
        
    Returns:
        Dict with balances across chains
        
    Example:
        >>> get_cross_chain_balances("YOUR_API_KEY", "0x26fcbd3afebbe28d0a8684f790c48368d21665b5")
        {
            'address': '0x26fcbd3afebbe28d0a8684f790c48368d21665b5',
            'balances': [
                {
                    'chain': 'eth',
                    'chain_name': 'Ethereum',
                    'raw_balance': '319973658297093018740',
                    'formatted_balance': '319.973658',
                    'symbol': 'ETH'
                },
                {
                    'chain': 'bsc',
                    'chain_name': 'Binance Smart Chain',
                    'raw_balance': '0',
                    'formatted_balance': '0.000000',
                    'symbol': 'BNB'
                },
                ...
            ]
        }
    """
    balances = []
    
    for chain in chains:
        try:
            result = get_native_balance(api_key, address, chain)
            
            if 'error' not in result:
                balances.append({
                    'chain': chain,
                    'chain_name': CHAIN_NAMES.get(chain, chain),
                    'raw_balance': result['raw_balance'],
                    'formatted_balance': result['formatted_balance'],
                    'symbol': CHAIN_SYMBOLS.get(chain, "")
                })
            else:
                balances.append({
                    'chain': chain,
                    'chain_name': CHAIN_NAMES.get(chain, chain),
                    'error': result['error'],
                    'symbol': CHAIN_SYMBOLS.get(chain, "")
                })
        except Exception as e:
            balances.append({
                'chain': chain,
                'chain_name': CHAIN_NAMES.get(chain, chain),
                'error': str(e),
                'symbol': CHAIN_SYMBOLS.get(chain, "")
            })
    
    return {
        'address': address,
        'balances': balances
    }

# Example usage
if __name__ == "__main__":
    # Replace with your actual API key
    API_KEY = "YOUR_API_KEY"
    
    # Example wallet address
    address = "0x26fcbd3afebbe28d0a8684f790c48368d21665b5"
    
    # Get API version
    version = get_api_version(API_KEY)
    print(f"Moralis API Version: {version['version']}")
    
    # Get native balance
    balance = get_native_balance(API_KEY, address)
    print(f"Native Balance: {balance['formatted_balance']} {balance['symbol']}")
    
    # Get cross-chain balances
    cross_chain = get_cross_chain_balances(API_KEY, address, ["eth", "bsc", "polygon"])
    print("\nCross-Chain Balances:")
    for bal in cross_chain['balances']:
        if 'error' not in bal:
            print(f"  {bal['chain_name']}: {bal['formatted_balance']} {bal['symbol']}")
        else:
            print(f"  {bal['chain_name']}: Error - {bal['error']}")
