"use client";

import LaneForm from '@/components/forms/lane-form';
import CustomModal from '@/components/global/custom-model';
import { Button } from '@/components/ui/button';
import { Lane, LaneDetail } from '@/lib/types/lane.types';
import { PipelineDetailsWithCardsTagsTickets } from '@/lib/types/pipeline.types';
import { Ticket } from '@/lib/types/ticket.types';
import { useModal } from '@/providers/modal-provider';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import PipelineLane from './pipeline-lane';
//import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';

type Props = {
    lanes: LaneDetail[]
    pipelineId: string;
    subaccountId: string;
    pipelineDetails: PipelineDetailsWithCardsTagsTickets
    updateLanesOrder: (lanes: Lane[]) => Promise<void>
    updateTicketsOrder: (tickets: Ticket[]) => Promise<void>
}

const PipelineView = ({
  lanes,
  pipelineId,
  subaccountId,
  pipelineDetails,
  updateLanesOrder,
  updateTicketsOrder,
}: Props) => {

  const { setOpen } = useModal();
  const router = useRouter();
  const [allLanes, setAllLanes] = useState<LaneDetail[]>([])

  useEffect(() => {
    setAllLanes(lanes)

  }, [lanes])

  const handleAddLane = () => {
    setOpen(
      <CustomModal
        title="Create Lane"
        subheading="Lanes allow to group tickets"
      >
        <LaneForm pipelineId={pipelineId} />
      </CustomModal>
    )
  }
  

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{pipelineDetails?.name}</h1>
          <Button
            className="flex items-center gap-4"
            onClick={handleAddLane}
          >
            <Plus size={15} />
            Create Lane
          </Button>
        </div>
        <Droppable
          droppableId="lanes"
          type="lane"
          direction="horizontal"
          key="lanes"
        >
          {(provided) => (
            <div
              className="flex item-center gap-x-2 overflow-scroll"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="flex mt-4">
                {allLanes.map((lane, index) => (
                  <PipelineLane />
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  )
}

export default PipelineView