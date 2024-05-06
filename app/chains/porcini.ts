/**
 * Porcini (Testnet) Network
 * 
 * Docs: https://wagmi.sh/core/api/chains#create-chain
 */

import { Address, type Chain } from 'viem'

const addresses = {
    7672: {
        ensEthRegistrarController: {
            address: '0xd64FA152497175B18352F44D720e55bc67faB7EB' as Address,
        },
    },
}

export const porcini = {
    id: 7672,
    name: 'The Root Network - Porcini Testnet',
    nativeCurrency: { name: 'Ripple', symbol: 'XRP', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://porcini.rootnet.app/archive'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Root Testnet',
            url: 'https://explorer.rootnet.cloud',
        },
    },
    contracts: {
        ...addresses[7672],
    },
    testnet: true,
} as const satisfies Chain

/**
 * Use this config to programatically add this network to a wallet
 */
export const porciniWalletConfig = {
    chainId: "0x1DF8",
    chainName: 'The Root Network - Porcini Testnet',
    nativeCurrency: { name: 'Ripple', symbol: 'XRP', decimals: 18 },
    rpcUrls: ['https://porcini.rootnet.app/archive'],
    blockExplorerUrls: ['https://explorer.rootnet.cloud'],
}