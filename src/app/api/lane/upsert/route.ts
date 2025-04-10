import { upsertLane } from "@/lib/actions/lane/upsert-lane-action";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const result = await upsertLane(body);

        return NextResponse.json(result, {status : 200});
    } catch (error) {
        console.error("API error in lane upsert:", error);
        return NextResponse.json(
            { error: 'Internal Server Error' }, 
            { status: 500 }
        );
    }
}