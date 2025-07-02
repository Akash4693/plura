import TicketForm from "@/components/forms/ticket-form";
import CustomModal from "@/components/global/custom-model";
import TagComponent from "@/components/global/tag";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useToast } from "@/hooks/use-toast";
import { saveActivityLogsNotification } from "@/lib/actions/notification/save-activity-logs-notification.actions";
import { TicketsAndTags, TicketWithTags } from "@/lib/types/ticket.types";
import { useModal } from "@/providers/modal-provider";
import { Contact2, Edit, LinkIcon, MoreHorizontalIcon, Trash, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";
import { Draggable } from "react-beautiful-dnd";

type Props = {
  setAllTickets: Dispatch<SetStateAction<TicketWithTags[]>>;
  ticket: TicketWithTags[0];
  allTickets: TicketWithTags[];
  subaccountId: string;
  index: number;
};

const PipelineTicket = ({
  setAllTickets,
  ticket,
  allTickets,
  subaccountId,
  index,
}: Props) => {
    const router = useRouter()
    const { setOpen, data } = useModal()
    const { toast } = useToast()
    
  ticket.value = Number(
  String(
    typeof ticket.value === "object"
      ? (ticket.value as { $numberDecimal: string }).$numberDecimal
      : ticket.value
  ).trim()
);

  
  
   console.log("Raw ticket.value:",typeof ticket.value);
    const editNewTicket = (updatedTicket: TicketsAndTags[]) => {
        const singleUpdatedTicket = updatedTicket[0];
        
        setAllTickets((currentTickets) => {
          // Find the ticket in the currentTickets array and replace it with the updated ticket
          return currentTickets.map((ticketArray) => {
            return ticketArray.map((existingTicket) =>
              existingTicket._id === singleUpdatedTicket._id ? singleUpdatedTicket : existingTicket
            );
          });
        });
      };

      

      const handleEditTicket = async () => {
        setOpen(
            <CustomModal
                title='Update Ticket'
                subheading='Update the ticket details'
            >
                <TicketForm 
                    getNewTicket={editNewTicket}
                    laneId={ticket.laneId.toString()}
                    subaccountId={subaccountId}
                />
            </CustomModal>,
            async () => {
                return { ticket: ticket }
            }
        )
      }

      const deleteTicket = async (ticketId: string) => {
        try {
          const response = await fetch(`/api/tickets/${ticketId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
      
          return await response.json();
        } catch (error) {
          console.error('Error deleting ticket:', error);
          throw error;
        }
      };
      
      const handleDeleteTicket = async () => {
          try {
            setAllTickets((allTickets) =>
                allTickets.map((ticketGroup) =>
                    ticketGroup.filter((ticketItem) => ticketItem._id !== ticket._id)
                ))

            const response = await deleteTicket(ticket._id)
            toast({
                title: "Ticket Deleted",
                description: "Ticket has been deleted successfully",
            })

            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Ticket ${ticket.name} has been deleted`,
                subAccountId: subaccountId,
            })

            router.refresh()
          } catch (error) {
            console.error("Error deleting ticket: ", error);
            
            toast({
                variant: "destructive",
                title: "Error Deleting Ticket",
                description: "Failed to delete ticket",
            })
          }
      }
      
      console.log("Ticket customer Id: ", ticket);

  return (
    <Draggable draggableId={ticket._id.toString()} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          const offset = { x: 300, y: 20 };
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
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <AlertDialog>
              <DropdownMenu>
                <Card className="my-4 dark:bg-slate-900 bg-white shadow-none transition-all">
                  <CardHeader className="p-[12px]">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg w-full">{ticket.name}</span>
                      <DropdownMenuTrigger>
                        <MoreHorizontalIcon className="text-muted-foreground" />
                      </DropdownMenuTrigger>
                    </CardTitle>
                    <span className="text-muted-foreground text-xs">
                      {new Date().toLocaleDateString()}
                    </span>
                    <div className="flex items-center flex-wrap gap-2">
                      {ticket.tags.map((tag) => {
                       
                        return (
                        <TagComponent
                          key={tag._id?.toString()}
                          title={tag.name}
                          colorName={tag.color}
                        />
                        )
                      })}
                    </div>
                    <CardDescription className="w-full">
                      {ticket.description}
                    </CardDescription>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="p-2 text-muted-foreground flex gap-2 hover:bg-muted transition-all rounded-lg cursor-pointer items-center">
                          <LinkIcon />
                          <span className="text-xs font-bold">CONTACT</span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent side="right" className="w-fit">
                        <div className="flex justify-between space-x-4">
                          <Avatar>
                            <AvatarImage />
                            <AvatarFallback className="bg-primary">
                              {ticket.customerId?.name
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">
                              {ticket.customerId?.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {ticket.customerId?.email}
                            </p>
                            <div className="flex items-center pt-2">
                              <Contact2 className="mr-2 h-4 w-4 opacity-70" />
                              <span className="text-xs text-muted-foreground">
                                Joined{" "}
                                {ticket.customerId?.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </CardHeader>
                  <CardFooter className="m-0 p-2 border-t-[1px] border-muted-foreground/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                            <AvatarImage 
                                alt="contact"
                                src={ticket.assignedUserId?.avatarUrl}
                            />
                            <AvatarFallback className="bg-primary text-sm text-white">
                                {ticket.assignedUserId?.name}
                                {!ticket.assignedUserId && <User2 size={14} />}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-center">
                            <span className="text-sm text-muted-foreground">
                                {ticket.assignedUserId ? "Assigned to" : "Unassigned"}
                            </span>
                            {ticket.assignedUserId && (
                                <span className="text-xs w-28 overflow-ellipsis overflow-hidden whitespace-nowrap text-muted-foreground">
                                    {ticket.assignedUserId?.name}
                                </span>
                            )}
                        </div>
                    </div>
                    <span className="text-sm font-bold">
                        {!!ticket.value && 
                            new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                            }).format(+ticket.value || 0)}
                    </span>
                  </CardFooter>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="flex items-center gap-2">
                            <Trash size={15} />
                            Delete Ticket
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <DropdownMenuItem 
                        className="flex items-center gap-2"
                        onClick={handleEditTicket}
                    >
                        <Edit size={15} />
                        Edit Ticket
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </Card>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Ticket
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Delete Ticket Permanently?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex items-center">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            className="bg-destructive"
                            onClick={handleDeleteTicket}
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

export default PipelineTicket;
