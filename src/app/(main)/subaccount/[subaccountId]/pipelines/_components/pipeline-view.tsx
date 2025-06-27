"use client";

import LaneForm from "@/components/forms/lane-form";
import CustomModal from "@/components/global/custom-model";
import { Button } from "@/components/ui/button";
import { Lane, LaneDetail } from "@/lib/types/lane.types";
import { PipelineDetailsWithCardsTagsTickets } from "@/lib/types/pipeline.types";
import { Ticket, TicketsAndTags, TicketWithTags } from "@/lib/types/ticket.types";
import { useModal } from "@/providers/modal-provider";
import { Flag, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import PipelineLane from "./pipeline-lane";
//import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';

type Props = {
  lanes: LaneDetail[];
  pipelineId: string;
  subaccountId: string;
  pipelineDetails: PipelineDetailsWithCardsTagsTickets;
  updateLanesOrder: (lanes: Lane[]) => Promise<void>;
  updateTicketsOrder: (tickets: Ticket[]) => Promise<void>;
};

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
  const [allLanes, setAllLanes] = useState<LaneDetail[]>([]);

  useEffect(() => {
    setAllLanes(lanes);
  }, [lanes]);

  const ticketsByLanes: TicketsAndTags[][] = [];

  const ticketsFromAllLanes: TicketsAndTags[] = [];

  lanes.forEach((lane) => {
    if (Array.isArray(lane.tickets)) {
      const validTickets: TicketsAndTags[] = [];
      lane.tickets.forEach((ticket) => {
        if ((ticket as TicketsAndTags)._id) {
          validTickets.push(ticket as TicketsAndTags);
        } else {
          console.warn("Skipping invalid ticket:", ticket);
        }
      });
      ticketsByLanes.push(validTickets);
    } else {
      console.warn("Lane has no tickets:", lane);
      ticketsByLanes.push([]); // Add empty array for lanes without tickets
    }
  });
  

  const [allTickets, setAllTickets] =
    useState<TicketsAndTags[][]>(ticketsByLanes);

  const handleAddLane = () => {
    setOpen(
      <CustomModal
        title="Create Lane"
        subheading="Lanes allow to group tickets"
      >
        <LaneForm pipelineId={pipelineId} />
      </CustomModal>
    );
  };

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{pipelineDetails?.name}</h1>
          <Button className="flex items-center gap-4" onClick={handleAddLane}>
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
              className="flex item-center gap-x-2 overflow-x-auto overflow-y-hidden"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="flex mt-4">
              {allLanes.map((lane, index) => {
                  // Ensure we have a valid array of tickets to pass
                  const laneTickets: TicketsAndTags[] = Array.isArray(lane.tickets) 
                    ? lane.tickets.filter((ticket): ticket is TicketsAndTags => 
                        (ticket as TicketsAndTags)._id !== undefined)
                    : [];
                    
                  return (
                    <PipelineLane
                      allTickets={allTickets}
                      setAllTickets={setAllTickets}
                      subaccountId={subaccountId}
                      pipelineId={pipelineId}
                      tickets={laneTickets}
                      laneDetails={lane}
                      index={index}
                      key={lane._id}
                    />
                  );
                })}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
        {allLanes.length === 0 && (
          <div className="flex items-center justify-center w-full flex-col">
            <div className="opacity-100">
              <Flag
                width="100%"
                height="100%"
                className="text-muted-foreground"
              />
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default PipelineView;
