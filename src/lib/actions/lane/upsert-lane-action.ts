"use server";

import { connectDB } from "@/lib/db";
import { LaneCreateInput } from "@/lib/types/lane.types";
import Lane from "@/models/lane.model";
import Pipeline from "@/models/pipeline.model";

export const upsertLane = async (lane: LaneCreateInput) => {
  try {
    await connectDB();

    let order: number;

    if (!lane.order) {
      const lanes = await Lane.find({ pipelineId: lane.pipelineId });
      order = lanes.length;
    } else {
      order = lane.order;
    }

    const filter = lane._id
      ? { _id: lane._id }
      : { name: lane.name, pipelineId: lane.pipelineId };

    const update = {
      $set: {
        name: lane.name,
        pipelineId: lane.pipelineId,
        order,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: lane.createdAt || new Date(),
      },
    };

    const options = {
      new: true,
      upsert: true,
    };

    const updatedLane = await Lane.findOneAndUpdate(filter, update, options);

    console.log("updated LaneId", updatedLane)
    if (!updatedLane) {
      throw new Error("Failed to create or update lane.");
    }

    await Pipeline.findByIdAndUpdate(
      lane.pipelineId,
      {
        $addToSet: { lane: updatedLane._id }, // avoids duplicates
      },
      { new: true }
    );

    return updatedLane;
  } catch (error) {
    console.error("Error upserting lane: ", error);
    throw new Error("Failed to upsert lane");
  }
};
