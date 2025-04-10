import Pipeline from '@/models/pipeline.model'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params: { subaccountId: string }
}

const Pipelines = async ({ params }: Props) => {
    const pipelineExists = await Pipeline.findOne({ subAccountId: params.subaccountId })

    if (pipelineExists) {
        return redirect(
            `/subaccount/${params.subaccountId}/pipelines/${pipelineExists._id}`
        )
    }

    try {
        const response = await Pipeline.create({
            name: "First Pipeline",
            subAccountId: params.subaccountId
        })

        console.log("Pipeline response", response)

        return redirect(
            `/subaccount/${params.subaccountId}/pipelines/${response._id}`
        )
    } catch (error) {
        console.log("Pipeline creation error:", error)
    }

    return <div>Pipelines</div>
}

export default Pipelines

