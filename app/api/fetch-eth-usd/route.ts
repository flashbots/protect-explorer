import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Missing date parameter' }, { status: 400 });
  }

  const cryptoCompareApiKey = process.env.CRYPTOCOMPARE_API_KEY;

  if (!cryptoCompareApiKey) {
    return NextResponse.json({ error: 'Missing CryptoCompare API key' }, { status: 500 });
  }

  try {
    const timestamp = new Date(date).getTime() / 1000;

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Authorization': `Apikey ${cryptoCompareApiKey}`,
      }
    };

    const response = await fetch(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts=${timestamp}`, requestOptions);
    const result = await response.json();

    const price = result.ETH.USD;
    if (price) {
      return NextResponse.json({ price }, { status: 200 });
    } else {
      throw new Error('No price data found for the specified date');
    }
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    return NextResponse.json({ error: 'Failed to fetch ETH price' }, { status: 500 });
  }
}
