import { upsertTag } from "@/lib/actions/tag/upsert-tag-action";
import { Tag } from "@/lib/types/tag.types";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const body = await req.json() ;
        
        const { subAccountId, ...tag } = body

        console.log("Tag upsert request received", body);

        if (!subAccountId) {
            return new Response(JSON.stringify({ error: "Missing or invalid subAccountId" }), { status: 400 });
        }

        if (!tag.name) {
            return new Response(JSON.stringify({ error: "Tag name is required" }), { status: 400 });
        }

        const result = await upsertTag(subAccountId, tag)
        
        console.log("Upserted Tag: ", tag);
        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("[UPSERT_TAG_ERROR]", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}