import { upsertPipeline } from "@/lib/actions/pipeline/upsert-pipeline-action";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { _id, name, subAccountId } = body

        console.log("Pipeline upsert request received", body)

        if (!name || !subAccountId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const pipeline = await upsertPipeline({ _id, name, subAccountId })
        console.log("Pipeline", pipeline)
        return NextResponse.json({ success: true, data: pipeline }, { status: 200 })
    } catch (error) {
        console.error('[UPSERT_PIPELINE_ERROR]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 
