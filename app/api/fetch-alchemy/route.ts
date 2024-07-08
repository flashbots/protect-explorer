import { NextRequest, NextResponse } from 'next/server';
import { Alchemy, Network } from 'alchemy-sdk';

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Name parameter is required' }, { status: 400 });
  }

  try {
    const resolvedAddress = await alchemy.core.resolveName(name);
    return NextResponse.json({ address: resolvedAddress });
  } catch (error) {
    console.error('Error resolving ENS name:', error);
    return NextResponse.json({ error: 'Error resolving ENS name' }, { status: 500 });
  }
}