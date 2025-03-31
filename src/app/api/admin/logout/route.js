import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json({ success: true });
        response.cookies.delete('admin_session');
        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Failed to process logout request' },
            { status: 500 }
        );
    }
}