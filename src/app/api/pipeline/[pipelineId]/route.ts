import { deletePipeline } from "@/lib/actions/pipeline/delete-pipeline-action";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { pipelineId: string } }
) {
  try {
    const { pipelineId } = params;

    if (!pipelineId) {
      return NextResponse.json(
        { error: "Pipeline ID is required" },
        { status: 400 }
      );
    }

    const deletedPipeline = await deletePipeline(pipelineId);

    return NextResponse.json(
      { message: "Pipeline deleted successfully", pipeline: deletedPipeline },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE pipeline API route:", error);
    return NextResponse.json(
      { error: "Failed to delete pipeline" },
      { status: 500 }
    );
  }
}
