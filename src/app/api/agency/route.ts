import { upsertAgency } from '@/lib/actions/agency/upsert-agency.actions';
import { NextResponse } from 'next/server';    // Using NextResponse for API responses

// Arrow function version
export const POST = async (req: Request) => {
  try {
    const data = await req.json(); // Parse JSON request body

    console.log("Data: ", data)
    if (!data) {
      // Validate data before proceeding
      return NextResponse.json(
        { message: 'Invalid data' },
        { status: 400 } // Return bad request if data is missing
      );
    }

    // Call your upsertAgency function
    const result = await upsertAgency(data);

    if (!result) {
      return NextResponse.json(
        { message: 'Failed to upsert agency. No result returned.' },
        { status: 500 }
      );
    }

    console.log("Agency upserted successfully", result)

    // Return the result in a JSON response with status 200 (OK)
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error in agency upsert:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    // Log the error and send a meaningful response
    return NextResponse.json(
      { message: 'Failed to upsert agency', error: errorMessage }, 
      { status: 500 }
    );
  }
};