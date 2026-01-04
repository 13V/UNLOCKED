import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'messages-db.json');

const getMessages = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            return [];
        }
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error("Error reading messages:", e);
        return [];
    }
};

const saveMessages = (messages: any[]) => {
    try {
        // Keep only last 50 messages
        const trimmed = messages.slice(-50);
        fs.writeFileSync(DB_PATH, JSON.stringify(trimmed, null, 2));
    } catch (e) {
        console.error("Error saving messages:", e);
    }
};

export async function GET() {
    return NextResponse.json(getMessages());
}

export async function POST(request: Request) {
    try {
        const { text, author } = await request.json();

        if (!text || !author) {
            return NextResponse.json({ error: 'Missing content' }, { status: 400 });
        }

        const messages = getMessages();
        const newMessage = {
            id: Date.now(),
            text: text.toUpperCase().substring(0, 280), // Sanitization
            author: author.toUpperCase().substring(0, 20),
            timestamp: new Date().toISOString()
        };

        messages.push(newMessage);
        saveMessages(messages);

        return NextResponse.json(newMessage);
    } catch (e: any) {
        console.error("Chat API Error:", e.message);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
