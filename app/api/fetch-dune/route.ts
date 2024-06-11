import { NextResponse } from 'next/server';

export async function GET() {
  const duneApiKey = process.env.DUNE_API_KEY;

  if (!duneApiKey) {
    return NextResponse.json({ error: 'Missing Dune API key' }, { status: 500 });
  }

  try {
    const result1 = await fetch(`https://api.dune.com/api/v1/query/3396976/results`, {
      headers: {
        'X-Dune-API-Key': duneApiKey,
      },
    }).then(res => res.json());

    const result2 = await fetch(`https://api.dune.com/api/v1/query/3397208/results`, {
      headers: {
        'X-Dune-API-Key': duneApiKey,
      },
    }).then(res => res.json());

    return NextResponse.json({ result1, result2 }, { status: 200 });
  } catch (error) {
    console.error('Error fetching metrics from Dune:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics from Dune' }, { status: 500 });
  }
}
