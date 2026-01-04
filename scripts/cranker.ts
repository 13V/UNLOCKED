import axios from 'axios';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const EXECUTE_URL = process.env.CRANK_URL || 'http://localhost:3001/api/execute';
const AUTH_SECRET = process.env.AUTH_SECRET || 'void_protocol_trigger';
const INTERVAL_MS = Number(process.env.CRANK_INTERVAL_MS) || 60000; // Default 1 minute

async function turnFlywheel() {
    try {
        console.log(`[CRANK] ${new Date().toISOString()} - Pinging protocol core...`);
        const response = await axios.post(EXECUTE_URL, {}, {
            headers: {
                'x-auth-secret': AUTH_SECRET
            }
        });

        if (response.data.success) {
            console.log('[CRANK] Success:', response.data.stats);
        } else {
            console.warn('[CRANK] Protocol reported failure:', response.data.error);
        }
    } catch (error: any) {
        console.error('[CRANK] Execution Error:', error.message);
    }
}

console.log(`[CRANK] System initiated. Cycle interval: ${INTERVAL_MS / 1000}s`);

// Initial run
turnFlywheel();

// Periodic loop
setInterval(turnFlywheel, INTERVAL_MS);
