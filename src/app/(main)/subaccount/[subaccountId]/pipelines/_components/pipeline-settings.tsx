"use client";

import CreatePipelineForm from '@/components/forms/create-pipeline-form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { saveActivityLogsNotification } from '@/lib/actions/notification/save-activity-logs-notification.actions';
import { deletePipeline } from '@/lib/actions/pipeline/delete-pipeline-action';
import { Pipeline } from '@/lib/types/pipeline.types';
import { useRouter } from 'next/navigation';

import React from 'react'


type Props = {
    pipelineId: string,
    subaccountId: string,
    pipelines: Pipeline[],
}

const PipelineSettings = ({
    pipelineId,
    subaccountId,
    pipelines,
}: Props) => {
    const { toast } = useToast()
    const router = useRouter()

    const currentPipeline = pipelines.find((pipeline) => pipeline._id === pipelineId)

  return (
    <AlertDialog>
        <div>
            <div className="flex items-center justify-between mb-4">
                <AlertDialogTrigger asChild>
                    <Button variant={"default"}>Delete Pipeline</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete This Pipeline</AlertDialogTitle>
                        <AlertDialogDescription>This Pipeline will be deleted permanently.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="items-center">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                try {
                                    await deletePipeline(pipelineId)
                                    
                                    await saveActivityLogsNotification({
                                            agencyId: undefined,
                                            description: `Deleted ${currentPipeline?.name} pipeline `,
                                            subAccountId: subaccountId,
                                          });
                                    toast({
                                        title: 'Pipeline deleted',
                                        description: 'Pipeline has been deleted successfully',
                                    })
                                    router.replace(`/subaccount/${subaccountId}/pipelines`)
                                } catch (error) {
                                    console.log("Failed to delete pipeline", error);
                                    toast({
                                        title: 'Error deleting pipeline',
                                        description: 'Failed to delete pipeline.',
                                    })
                                }
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </div>

            <CreatePipelineForm 
                subAccountId={subaccountId}
                defaultData={pipelines.find(pipeline => pipeline._id === pipelineId)}
            />
        </div>
    </AlertDialog>
  )
}

export default PipelineSettings