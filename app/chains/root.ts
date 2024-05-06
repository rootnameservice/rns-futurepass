/**
 * Root (mainnet) Network
 * 
 * Docs: https://wagmi.sh/core/api/chains#create-chain
 */

import { Address, type Chain } from 'viem'

const addresses = {
    7668: {
        ensEthRegistrarController: {
            address: '0x25ED7268B38c5C0095a1C40dbA795BA10D6b46C9' as Address,
        },

    },
}

export const root = {
    id: 7668,
    name: 'The Root Network',
    nativeCurrency: { name: 'Ripple', symbol: 'XRP', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://root.rootnet.live/'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Root Mainnet',
            url: 'https://explorer.rootnet.live',
        },
    },
    contracts: {
        ...addresses[7668],
    },
} as const satisfies Chain

/**
 * Use this config to programatically add this network to a wallet
 */
export const rootWalletConfig = {
    chainId: "0x1DF4",
    chainName: 'The Root Network',
    nativeCurrency: { name: 'Ripple', symbol: 'XRP', decimals: 18 },
    rpcUrls: ['https://root.rootnet.live/'],
    blockExplorerUrls: ['https://explorer.rootnet.live'],
}