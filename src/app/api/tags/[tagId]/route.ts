import { deleteTag } from "@/lib/actions/tag/delete-tag-action";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { tagId: string } }
    ) => {
    try {
        const { tagId } = params;
    
        if (!tagId) {
        return NextResponse.json(
            { error: "Tag ID is required" },
            { status: 400 }
        );
        }
    
        const deletedTag = await deleteTag(tagId);
    
        return NextResponse.json(
        { message: "Tag deleted successfully", data: deletedTag },
        { status: 200 }
        );
    } catch (error) {
        console.error("Error in DELETE tag API route:", error);
        return NextResponse.json(
        { error: "Failed to delete tag" },
        { status: 500 }
        );
    }
    }