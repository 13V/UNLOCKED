import { NextResponse } from 'next/server';
import { getAccruedFees, connection, getWallet, getPersistentStats } from '@/lib/flywheel';

export async function GET() {
    try {
        const accruedFees = await getAccruedFees();
        const wallet = getWallet();
        let walletBalance = 0;

        if (wallet) {
            const balance = await connection.getBalance(wallet.publicKey);
            walletBalance = balance / 1e9;
        }

        const pStats = getPersistentStats();

        return NextResponse.json({
            accruedFees,
            walletBalance,
            totalFeesClaimed: pStats.totalFeesClaimed,
            totalTokensBurned: pStats.totalTokensBurned
        });
    } catch (error) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch protocol stats' }, { status: 500 });
    }
}
