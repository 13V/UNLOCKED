import {
    Connection,
    PublicKey
} from '@solana/web3.js';

const RPC_URL = process.env.RPC_URL || 'https://api.mainnet-beta.solana.com';
export const connection = new Connection(RPC_URL, 'confirmed');

export async function getTokenBalance(walletAddress: string, tokenMintAddress: string) {
    try {
        const wallet = new PublicKey(walletAddress);
        const mint = new PublicKey(tokenMintAddress);
        const response = await connection.getParsedTokenAccountsByOwner(wallet, { mint });

        if (response.value.length === 0) return 0;

        return response.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0;
    } catch (e) {
        console.error("Error fetching token balance:", e);
        return 0;
    }
}
