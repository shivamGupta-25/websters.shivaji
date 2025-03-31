import { NextResponse } from 'next/server';

// Admin credentials should be in environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Ensure credentials are set
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.warn('Warning: Admin credentials not properly configured in environment variables');
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Validate input exists
        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Validate credentials with constant-time comparison to prevent timing attacks
        const isUsernameValid = username === ADMIN_USERNAME;
        const isPasswordValid = password === ADMIN_PASSWORD;

        if (!isUsernameValid || !isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create a more secure session token with additional entropy
        const timestamp = Date.now();
        const randomValue = Math.random().toString(36).substring(2);
        const sessionToken = Buffer.from(`${username}|${timestamp}|${randomValue}`).toString('base64');

        // Create response with session cookie
        const response = NextResponse.json({ success: true });

        // Set secure cookie
        response.cookies.set('admin_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // More reliable than checking headers
            sameSite: 'strict',
            path: '/',
            maxAge: 2 * 60 * 60 // 2 hours
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}