import {
    Connection,
    Keypair,
    PublicKey,
    VersionedTransaction,
    Transaction,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import {
    createBurnInstruction,
    getAssociatedTokenAddress,
    getAccount
} from '@solana/spl-token';
import axios from 'axios';
import bs58 from 'bs58';
import fs from 'fs';
import path from 'path';
import { getPumpMarketCap } from './bonding-curve';

const STATS_PATH = path.join(process.cwd(), 'data', 'stats-db.json');

const RPC_URL = process.env.RPC_URL || 'https://api.mainnet-beta.solana.com';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const TOKEN_MINT_STR = process.env.TOKEN_MINT || '2oCDo9xrmcPUdmsieFcmoUXKN3k86b2RWUr2hVM7pump';
const PUMP_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');

export const connection = new Connection(RPC_URL, 'confirmed');

export const getWallet = () => {
    if (!PRIVATE_KEY) return null;
    try {
        return Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    } catch (e) {
        console.error("Invalid Private Key format");
        return null;
    }
};

export const getPersistentStats = () => {
    try {
        if (!fs.existsSync(STATS_PATH)) {
            const initial = { totalFeesClaimed: 0, totalTokensBurned: 0, lastUpdate: null };
            fs.writeFileSync(STATS_PATH, JSON.stringify(initial, null, 2));
            return initial;
        }
        const data = fs.readFileSync(STATS_PATH, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error("Error reading stats db:", e);
        return { totalFeesClaimed: 0, totalTokensBurned: 0, lastUpdate: null };
    }
};

export const updatePersistentStats = (claimedFees: number, tokensBurned: number) => {
    try {
        const stats = getPersistentStats();
        stats.totalFeesClaimed += claimedFees;
        stats.totalTokensBurned += tokensBurned;
        stats.lastUpdate = new Date().toISOString();
        fs.writeFileSync(STATS_PATH, JSON.stringify(stats, null, 2));
        return stats;
    } catch (e) {
        console.error("Error updating stats db:", e);
    }
};

export async function getAccruedFees() {
    if (!TOKEN_MINT_STR) return 0;
    try {
        const tokenMint = new PublicKey(TOKEN_MINT_STR);
        const [revenuePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("creator-revenue"), tokenMint.toBuffer()],
            PUMP_PROGRAM_ID
        );
        const balance = await connection.getBalance(revenuePda);
        return balance / 1e9;
    } catch (e) {
        console.error("Error fetching fees:", e);
        return 0;
    }
}

export async function claimFees() {
    const wallet = getWallet();
    if (!wallet) throw new Error("Wallet not configured");

    try {
        const response = await axios.post('https://pumpportal.fun/api/trade-local', {
            "publicKey": wallet.publicKey.toBase58(),
            "action": "collectCreatorFee",
            "priorityFee": 0.0001
        }, {
            headers: { "Content-Type": "application/json" },
            responseType: 'arraybuffer'
        });

        const tx = VersionedTransaction.deserialize(new Uint8Array(response.data));
        tx.sign([wallet]);

        const signature = await connection.sendRawTransaction(tx.serialize());
        await connection.confirmTransaction(signature);
        return signature;
    } catch (e: any) {
        console.error("Error claiming fees:", e.message);
        throw e;
    }
}

export async function swapSolToToken(solAmountIn: number) {
    const wallet = getWallet();
    if (!wallet) throw new Error("Wallet not configured");
    if (!TOKEN_MINT_STR) throw new Error("Token Mint not configured");

    try {
        const response = await axios.post('https://pumpportal.fun/api/trade-local', {
            "publicKey": wallet.publicKey.toBase58(),
            "action": "buy",
            "mint": TOKEN_MINT_STR,
            "amount": solAmountIn,
            "denominatedInSol": true,
            "slippage": 10,
            "priorityFee": 0.0001,
            "pool": "pump"
        }, {
            headers: { "Content-Type": "application/json" },
            responseType: 'arraybuffer'
        });

        const tx = VersionedTransaction.deserialize(new Uint8Array(response.data));
        tx.sign([wallet]);
        const signature = await connection.sendRawTransaction(tx.serialize());
        await connection.confirmTransaction(signature);
        return signature;
    } catch (e: any) {
        console.error("Error swapping SOL:", e.message);
        throw e;
    }
}

export async function burnTokens(amount: number) {
    const wallet = getWallet();
    if (!wallet || !TOKEN_MINT_STR) throw new Error("Config missing");

    try {
        const mint = new PublicKey(TOKEN_MINT_STR);
        const ata = await getAssociatedTokenAddress(mint, wallet.publicKey);
        const burnAmount = Math.floor(amount * 1000000); // 6 decimals

        const transaction = new Transaction().add(
            createBurnInstruction(
                ata,
                mint,
                wallet.publicKey,
                burnAmount
            )
        );

        const signature = await sendAndConfirmTransaction(connection, transaction, [wallet]);
        return signature;
    } catch (e: any) {
        console.error("Error burning tokens:", e.message);
        throw e;
    }
}

export async function runAutonomousCycle() {
    const stats = {
        feesClaimed: 0,
        tokensBought: 0,
        burnSignature: ''
    };

    try {
        // 0. Fetch Current Market Cap for Milestone Gating
        const currentMc = await getPumpMarketCap(TOKEN_MINT_STR);
        console.log(`[FLY] Current Market Cap: $${Math.floor(currentMc)}`);

        if (currentMc < 20000) {
            console.log("[FLY] Gated: Market Cap below $20,000. Protocol inactive.");
            return stats;
        }

        // 1. Check & Claim Fees
        const accrued = await getAccruedFees();
        if (accrued > 0.001) {
            console.log(`[FLY] Claiming ${accrued} SOL in fees...`);
            await claimFees();
            stats.feesClaimed = accrued;
        }

        // 2. Check Wallet Balance
        const wallet = getWallet();
        if (!wallet) return stats;

        const balance = await connection.getBalance(wallet.publicKey);
        const solBalance = balance / 1e9;

        // 3. Buyback if balance > threshold (0.05 SOL)
        if (solBalance > 0.05) {
            const swapAmount = solBalance - 0.01; // Keep 0.01 for gas
            console.log(`[FLY] Executing Buyback for ${swapAmount} SOL...`);

            // Get balance before swap to calculate tokens bought
            const mint = new PublicKey(TOKEN_MINT_STR);
            const ata = await getAssociatedTokenAddress(mint, wallet.publicKey);
            let balanceBefore = 0;
            try {
                const acc = await getAccount(connection, ata);
                balanceBefore = Number(acc.amount);
            } catch (e) { }

            await swapSolToToken(swapAmount);

            // Get balance after
            await new Promise(r => setTimeout(r, 2000));
            const accAfter = await getAccount(connection, ata);
            const balanceAfter = Number(accAfter.amount);
            const tokensSecured = (balanceAfter - balanceBefore) / 1e6;
            stats.tokensBought = tokensSecured;

            // Gating: Only burn if MC >= 45,000 (Supply Erosion Milestone)
            if (tokensSecured > 0) {
                if (currentMc >= 45000) {
                    console.log(`[FLY] Supply Erosion Active: Burning ${tokensSecured} tokens...`);
                    stats.burnSignature = await burnTokens(tokensSecured);
                } else {
                    console.log(`[FLY] Gated: Market Cap below $45,000. Secured ${tokensSecured} tokens stored in treasury.`);
                }
            }
        }

        // 4. Persist Results
        updatePersistentStats(stats.feesClaimed, stats.tokensBought);

        return stats;
    } catch (e: any) {
        console.error("Autonomous Cycle Failed:", e.message);
        throw e;
    }
}
