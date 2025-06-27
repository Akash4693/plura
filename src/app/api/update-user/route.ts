
import { updateUser } from '@/lib/actions/user/update-user.action';
import { NextResponse } from 'next/server';  


export const POST = async (req: Request) => {
  try {
    const data = await req.json(); 

    console.log("post data",data)

    if (!data) {
      
      return NextResponse.json(
        { message: 'Invalid data' },
        { status: 400 } 
      );
    }

    
    const result = await updateUser(data);

    if (!result) {
    
      return NextResponse.json(
        { message: 'User update failed' },
        { status: 400 } 
      );
    }

   
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error in user update:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    // Log the error and send a meaningful response
    return NextResponse.json(
      { message: 'Failed to update user', error: errorMessage },
      { status: 500 }
    );
  }
};
