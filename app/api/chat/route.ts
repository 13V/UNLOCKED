import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });

        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(50);

        if (error) throw error;
        return NextResponse.json(messages?.reverse() || []); // Flip back for chronological UI
    } catch (e: any) {
        console.error("Chat GET Error:", e.message);
        return NextResponse.json([], { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });

        const { text, author } = await request.json();

        if (!text || !author) {
            return NextResponse.json({ error: 'Missing content' }, { status: 400 });
        }

        const { data: newMessage, error } = await supabase
            .from('messages')
            .insert([
                {
                    text: text.toUpperCase().substring(0, 280),
                    author: author.toUpperCase().substring(0, 20)
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(newMessage);
    } catch (e: any) {
        console.error("Chat POST Error:", e.message);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
