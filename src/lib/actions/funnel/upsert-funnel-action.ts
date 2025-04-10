"use server";

import { connectDB } from "@/lib/db";
import Funnel from "@/models/funnel.model";
import type { Funnel as FunnelType } from "@/lib/types/funnel.types";
import { z } from "zod";

const createFunnelFormSchema = z.object({
  name: z.string().min(1, { message: "Funnel name is required" }),
  description: z.string().optional(),
  subDomainName: z.string().optional(),
  favicon: z.string().optional(),
});

type CreateFunnelType = z.infer<typeof createFunnelFormSchema> & {
  liveProducts: string[];
};

export const upsertFunnel = async (
  subAccountId: string,
  funnel: CreateFunnelType,
  funnelId: string
): Promise<FunnelType | null> => {
  try {
    await connectDB();

    const filter = funnelId
      ? { _id: funnelId }
      : { name: funnel.name, subAccountId };

    const response = await Funnel.findOneAndUpdate(
      filter,
      {
        $set: {
          ...funnel,
          subAccountId,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return response;
  } catch (error) {
    console.error("Error upserting funnel:", error);
    throw new Error("Failed to upsert funnel");
  }
};
