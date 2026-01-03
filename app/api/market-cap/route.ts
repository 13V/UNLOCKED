import { NextResponse } from 'next/server';
import axios from 'axios';
import { getPumpMarketCap } from '@/lib/bonding-curve';

const TOKEN_MINT = process.env.TOKEN_MINT || '2oCDo9xrmcPUdmsieFcmoUXKN3k86b2RWUr2hVM7pump';

export async function GET() {
    try {
        const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN_MINT}`);

        if (response.data && response.data.pairs && response.data.pairs.length > 0) {
            const pair = response.data.pairs[0];
            return NextResponse.json({
                marketCap: pair.fdv || 0,
                price: pair.priceUsd || "0",
                symbol: pair.baseToken.symbol,
                address: pair.pairAddress,
                source: 'dexscreener'
            });
        }

        // Fallback: Fetch directly from Pump.fun bonding curve on-chain
        const pumpMc = await getPumpMarketCap(TOKEN_MINT);
        return NextResponse.json({
            marketCap: Math.floor(pumpMc),
            price: "0",
            status: "bonding_curve",
            source: 'pumpfun_onchain'
        });
    } catch (error) {
        console.error('Market Cap Error:', error);
        return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
    }
}
