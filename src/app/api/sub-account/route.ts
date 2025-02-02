import { upsertSubAccount } from '@/lib/actions/sub-account/upsert-sub-account.action';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const data = await req.json(); // Parse JSON request body

    console.log("Received Body in API Route:", data);
    if (!data) {
      return NextResponse.json(
        { message: 'Invalid data. Company email is required.' },
        { status: 400 }
      );
    }

    // Call your upsertSubAccount function
    const result = await upsertSubAccount(data);

    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('Error in subAccount upsert:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { message: 'Failed to upsert subAccount', error: errorMessage }, 
      { status: 500 }
    );
  }
};
