import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const fetchClickhouseData = async () => {
  const { CLICKHOUSE_KEY_ID: keyId, CLICKHOUSE_KEY_SECRET: keySecret } = process.env;
  const url = 'https://console-api.clickhouse.cloud/.api/query-endpoints/391d7f1a-0ea5-4163-b7ea-3558638f4dbb/run';

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const data = {
    format: 'JSONEachRow',
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      }
    });

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error message:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    } else {
      console.error('Error fetching Clickhouse data', error);
    }
    throw error;
  }
};

export async function GET(req: NextRequest) {
  try {
    const data = await fetchClickhouseData();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data from Clickhouse' }, { status: 500 });
  }
}