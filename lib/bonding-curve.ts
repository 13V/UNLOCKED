import {
    PublicKey
} from '@solana/web3.js';
import { connection } from './flywheel';

const PUMP_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');

export async function getPumpMarketCap(mintAddress: string) {
    try {
        const mint = new PublicKey(mintAddress);
        const [bondingCurve] = PublicKey.findProgramAddressSync(
            [Buffer.from("bonding-curve"), mint.toBuffer()],
            PUMP_PROGRAM_ID
        );

        const accountInfo = await connection.getAccountInfo(bondingCurve);
        if (!accountInfo) return 0;

        // Pump.fun Bonding Curve Layout (Skip 8 byte discriminator)
        // virtual_token_reserves (u64, 8 bytes)
        // virtual_sol_reserves (u64, 8 bytes)
        // ...
        const data = accountInfo.data;
        const virtualTokenReserves = data.readBigUInt64LE(8);
        const virtualSolReserves = data.readBigUInt64LE(16);

        // Price in SOL = virtualSolReserves / virtualTokenReserves
        // Total Supply for all Pump.fun tokens is 1,000,000,000
        const totalSupply = BigInt(1000000000) * BigInt(10 ** 6); // 1B tokens with 6 decimals

        // MC in SOL = (virtualSolReserves / virtualTokenReserves) * totalSupply
        // Using BigInt for precision, then converting to number
        const mcSol = (virtualSolReserves * totalSupply) / virtualTokenReserves;
        const mcSolNumber = Number(mcSol) / 1e9; // 1e9 for SOL decimals

        // Fetch SOL price (simple mock or quick fetch)
        const solPrice = await getSolPrice();

        return mcSolNumber * solPrice;
    } catch (e) {
        console.error("Error fetching Pump.fun MC:", e);
        return 0;
    }
}

async function getSolPrice(): Promise<number> {
    try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana/8sc9w77ucre7n5v2rqrnzmsfndxpkpoy99wa9m6fntpx');
        const data = await response.json();
        return parseFloat(data.pair.priceUsd) || 150; // Fallback to 150 if error
    } catch (e) {
        return 150;
    }
}
