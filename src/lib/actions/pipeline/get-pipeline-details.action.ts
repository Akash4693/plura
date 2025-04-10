"use server"

import { connectDB } from "@/lib/db";
import Pipeline from "@/models/pipeline.model";

export const getPipelineDetails = async ( pipelineId: string ) => {
    try {
        await connectDB()
        const response = await Pipeline.findById(pipelineId)
        
        return response;
    } catch (error) {
        console.error('Error fetching Pipelines:', error);
        throw new Error('Failed to fetch Pipelines.');
    }
}


