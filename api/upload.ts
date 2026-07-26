import { put } from '@vercel/blob';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    // Security: Verify Supabase Session Token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response('Unauthorized: Missing or invalid token', { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return new Response('Unauthorized: Invalid session', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename') || 'untitled';

    try {
        const bodyContent = await req.arrayBuffer(); // Node environment fallback
        const blob = await put(filename, bodyContent, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return new Response(JSON.stringify(blob), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (uploadError) {
        return new Response(JSON.stringify({ error: (uploadError as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
