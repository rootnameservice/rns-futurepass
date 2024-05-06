import { http, createConfig } from '@wagmi/core'
import { injected } from '@wagmi/connectors'
import { root } from './root'
import { porcini } from './porcini'
import { createPublicClient } from 'viem'

// TODO: Create an official RNS project in WalletConnect
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ""

export const config = createConfig({
    chains: [porcini, root],
    connectors: [
        injected({
            shimDisconnect: true,
            target: "metaMask"
        }),
    ],
    transports: {
        [porcini.id]: http(),
        [root.id]: http()
    },
    ssr: true
})

export const publicClient = createPublicClient({
    chain: porcini,
    transport: http(),
})