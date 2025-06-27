
import { deleteTicket } from "@/lib/actions/ticket/delete-ticket-action";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { ticketId } = params;

    if (!ticketId) {
      return NextResponse.json(
        { error: "Ticket ID is required" },
        { status: 400 }
      );
    }

    const deletedTicket = await deleteTicket(ticketId);

    return NextResponse.json(
      { message: "Ticket deleted successfully", ticket: deletedTicket },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE ticket API route:", error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}