import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLanesWithTicketAndTags } from '@/lib/actions/lane/getLanesWithTicketAndTags.action';
import { getPipelineDetails } from '@/lib/actions/pipeline/get-pipeline-details.action';
import { LaneDetail } from '@/lib/types/lane.types';
import Pipeline from '@/models/pipeline.model';
import { redirect } from 'next/navigation';
import React from 'react'
import PipelineInfoBar from '../_components/pipeline-infobar';
import PipelineSettings from '../_components/pipeline-settings';
import PipelineView from '../_components/pipeline-view';
import { updateLanesOrder } from '@/lib/actions/lane/update-lanes-order-action';
import { updateTicketsOrder } from '@/lib/actions/ticket/update-ticket-order-action';

type Props = {
  params: { 
    subaccountId: string; 
    pipelineId: string 
  }
}

const PipelinePage = async ({ params }: Props) => {
  const pipelineDetails = await getPipelineDetails(params.pipelineId)
  if (!pipelineDetails) {
    return redirect(`/subaccount/${params.subaccountId}/pipelines`)
  }

  const pipelines = await Pipeline.find({ subAccountId : params.subaccountId})

  const lanes = (await getLanesWithTicketAndTags(
    params.pipelineId
  )) as LaneDetail[];
  
  return (
    <Tabs
      defaultValue="view"
      className="w-full"
    >
      <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
        <PipelineInfoBar
          subAccountId={params.subaccountId}
          pipelines={pipelines}
          pipelineId={params.pipelineId}
        />
        <div>
          <TabsTrigger value="view">Pipeline View</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="view">
        <PipelineView 
          lanes={lanes}
          pipelineId={params.pipelineId}
          subaccountId={params.subaccountId}
          pipelineDetails={pipelineDetails}
          updateLanesOrder={updateLanesOrder}
          updateTicketsOrder={updateTicketsOrder}
        />
      </TabsContent>
      <TabsContent value="settings">
        <PipelineSettings
          subaccountId={params.subaccountId}
          pipelineId={params.pipelineId}
          pipelines={pipelines}
        />
      </TabsContent>
    </Tabs>
  )
}

export default PipelinePage