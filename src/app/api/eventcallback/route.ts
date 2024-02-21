import { NextRequest, NextResponse } from 'next/server';
import { twilioClient } from '@/lib/twilioClient';

export async function POST(req: NextRequest) {


    console.log("RAAAAA")
    // console.log(req)

    const params = req.nextUrl.searchParams;
    console.log(Array.from(params.entries()));

    return new NextResponse(null, { status: 204, headers: { 'Content-Type': 'application/json' } });
}