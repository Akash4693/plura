"use server";

import { connectDB } from "@/lib/db";
import { PipelineUncheckedCreateWithoutLaneInput } from "@/lib/types/pipeline.types";
import Pipeline from "@/models/pipeline.model";

export const upsertPipeline = async (
    pipeline: PipelineUncheckedCreateWithoutLaneInput
) => {
    try {
        await connectDB();

        const filter = pipeline._id ? { _id: pipeline._id } : { name: pipeline.name, subAccountId: pipeline.subAccountId  }

        const response = await Pipeline.findOneAndUpdate(
            filter,
            {
                $set: {
                    name: pipeline.name,
                    subAccountId: pipeline.subAccountId,
                    updatedAt: new Date(),
                },
                $setOnInsert: {
                    createdAt: pipeline.createdAt || new Date(),
                },
            },
            {
                new: true,
                upsert: true,
            }
        )
        console.log("Pipeline upserted successfully", response)
        return response;
    } catch (error) {
        console.error("Error while upserting pipeline: ", error)
        throw new Error("Failed to upsert pipeline")
    }

}