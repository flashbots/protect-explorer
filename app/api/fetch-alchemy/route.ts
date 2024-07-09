import { NextResponse } from 'next/server';
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'ENS name is required' }, { status: 400 });
  }

  try {
    const address = await provider.resolveName(name);

    if (address === null) {
      return NextResponse.json({ error: 'ENS name not found or has no address set' }, { status: 404 });
    }

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Error resolving ENS name:", error);
    return NextResponse.json({ error: 'Failed to resolve ENS name' }, { status: 500 });
  }
}