"use client";

import LaneForm from "@/components/forms/lane-form";
import TicketForm from "@/components/forms/ticket-form";
import CustomModal from "@/components/global/custom-model";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteLane } from "@/lib/actions/lane/delete-lane-action";
import { saveActivityLogsNotification } from "@/lib/actions/notification/save-activity-logs-notification.actions";
import { LaneDetail } from "@/lib/types/lane.types";
import { TicketsAndTags, TicketWithTags } from "@/lib/types/ticket.types";
import { cn } from "@/lib/utils/classNames";
import { useModal } from "@/providers/modal-provider";
import { Edit, MoreVertical, PlusCircleIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useMemo } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import PipelineTicket from "./pipeline-ticket";

//WIP Wire up tickets
interface PipelineLaneProps {
  setAllTickets: Dispatch<SetStateAction<TicketWithTags[]>>;
  allTickets: TicketWithTags[];
  tickets: TicketsAndTags[];
  pipelineId: string;
  laneDetails: LaneDetail;
  subaccountId: string;
  index: number;
}

const PipelineLane: React.FC<PipelineLaneProps> = ({
  setAllTickets,
  allTickets,
  tickets,
  pipelineId,
  laneDetails,
  subaccountId,
  index,
}) => {
  const { setOpen } = useModal();
  const router = useRouter();

  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const laneAmount = useMemo(() => {
  return tickets.reduce((sum, ticket) => {
    const raw = ticket?.value;
    const normalized = +((raw as any)?.$numberDecimal ?? raw); // <-- magic line
    console.log("ticket.value =>", normalized);
    return sum + (normalized || 0);
  }, 0);
}, [tickets]);

  const randomColor = `#${Math.random().toString(16).slice(2, 8)}`;

  const addNewTicket = (ticket: TicketWithTags) => {
    setAllTickets([...allTickets, ticket]);
  };

  const handleCreateTicket = () => {
    setOpen(
      <CustomModal
        title="Create Ticket"
        subheading="Tickets are a way to track work and assign it to team members."
      >
        <TicketForm
          getNewTicket={addNewTicket}
          laneId={laneDetails._id}
          subaccountId={subaccountId}
        />
      </CustomModal>
    );
  };

  const handleEditLane = () => {
    setOpen(
      <CustomModal title="Edit Lane" subheading="Edit lane details">
        <LaneForm pipelineId={pipelineId} defaultData={laneDetails} />
      </CustomModal>
    );
  };

  const handleDeleteLane = async () => {
    try {
      const response = await deleteLane(laneDetails._id);
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted lane ${response?.name}`,
        subAccountId: subaccountId,
      });
      router.refresh();
    } catch (error) {
      console.error("Error deleting lane:", error);
    }
  };

  console.log("laneDetails", laneDetails);

  return (
    <Draggable
      draggableId={laneDetails._id}
      index={index}
      key={laneDetails._id}
    >
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          //@ts-ignore
          const offset = { x: 300, y: 0 };
          //@ts-ignore
          const x = provided.draggableProps.style?.left - offset.x;
          //@ts-ignore
          const y = provided.draggableProps.style?.top - offset.y;
          //@ts-ignore
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            left: x,
            top: y,
          };
        }
        return (
          <div
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="h-full"
          >
            <AlertDialog>
              <DropdownMenu>
                <div className="bg-slate-200/30 dark:bg-background/20 h-[700px] w-[300px] px-4 relative rounded-lg overflow-visible flex-shrink-0">
                  <div
                    {...provided.dragHandleProps}
                    className="h-14 backdrop-blur-lg dark:bg-background/40 bg-slate-200/60 absolute top-0 left-0 right-0 z-10"
                  >
                    <div className="h-full flex items-center p-4 justify-between cursor-grab border-b-[1px]">
                      {/* laneDetails.order */}
                      <div className="flex items-center w-full gap-2">
                        <div
                          className={cn("w-4 h-4 rounded-full")}
                          style={{ background: randomColor }}
                        />
                        <span className="font-bold text-sm">
                          {laneDetails.name}
                        </span>
                      </div>
                      <div className="flex items-center flex-row">
                        <Badge className="bg-white text-black">
                          {amount.format(laneAmount)}
                        </Badge>
                        <DropdownMenuTrigger>
                          <MoreVertical className="text-muted-foreground cursor-pointer" />
                        </DropdownMenuTrigger>
                      </div>
                    </div>
                  </div>

                  <Droppable
                    droppableId={laneDetails._id.toString()}
                    key={laneDetails._id}
                    type="ticket"
                  >
                    {(provided) => (
                      <div className="max-h-[700px] pt-12 overflow-y-auto scrollbar-hide ">
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="mt-2"
                        >
                          {tickets.map((ticket, index) => (
                            <PipelineTicket
                              allTickets={allTickets}
                              setAllTickets={setAllTickets}
                              subaccountId={subaccountId}
                              ticket={ticket}
                              key={ticket._id.toString()}
                              index={index}
                            />
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>

                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Trash size={15} />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={handleEditLane}
                    >
                      <Edit size={15} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={handleCreateTicket}
                    >
                      <PlusCircleIcon size={15} />
                      Create Ticket
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </div>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Lane</AlertDialogTitle>
                    <AlertDialogDescription>
                      Delete this lane and all its tickets?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={handleDeleteLane}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </DropdownMenu>
            </AlertDialog>
          </div>
        );
      }}
    </Draggable>
  );
};

export default PipelineLane;
