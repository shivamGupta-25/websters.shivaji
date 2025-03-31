import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';

/**
 * Handler for GET and POST requests to manage site content
 */
export async function GET() {
    try {
        await connectToDatabase();

        const content = await SiteContent.findOne({});

        if (!content) {
            return NextResponse.json(
                { message: 'Content not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        return NextResponse.json(
            { message: 'Failed to fetch content' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        if (!body || Object.keys(body).length === 0) {
            return NextResponse.json(
                { message: 'Request body is required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const existingContent = await SiteContent.findOne({});
        let content;

        if (existingContent) {
            content = await SiteContent.findByIdAndUpdate(
                existingContent._id,
                body,
                { new: true, runValidators: true }
            );
        } else {
            content = await SiteContent.create(body);
        }

        return NextResponse.json(content, { status: 200 });
    } catch (error) {
        console.error('Error updating content:', error);

        // Provide more specific error messages for common issues
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { message: 'Validation error', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Failed to update content' },
            { status: 500 }
        );
    }
}