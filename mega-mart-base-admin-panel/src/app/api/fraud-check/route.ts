import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { phone_number } = await req.json();

    const { data } = await axios.post(
      'https://fraudbd.com/api/check-courier-info',
      { phone_number },
      {
        headers: {
          'Content-Type': 'application/json',
          api_key: process.env.FRAUDBD_API_KEY!,
          user_name: process.env.FRAUDBD_USERNAME!,
          password: process.env.FRAUDBD_PASSWORD!,
        },
      }
    );

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data || 'Something went wrong' },
      { status: error.response?.status || 500 }
    );
  }
}
