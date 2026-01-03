import { NextResponse } from 'next/server';
import { runAutonomousCycle } from '@/lib/flywheel';

const AUTH_SECRET = process.env.AUTH_SECRET || 'void_protocol_trigger';

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('x-auth-secret');

        if (authHeader !== AUTH_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('[API] Triggering Autonomous Cycle...');
        const stats = await runAutonomousCycle();

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            stats
        });
    } catch (error: any) {
        console.error('Execution Error:', error.message);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
