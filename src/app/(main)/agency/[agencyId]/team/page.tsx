"use client"

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import DataTable from "./data-table";
import { columns } from "./columns";
import SendInvitation from "@/components/forms/send-invitation";
import { currentUser } from "@clerk/nextjs";
import { Agency as AgencyType } from "@/lib/types/agency.types";
import { Types } from "mongoose";
import User from "@/models/user.model";
import { PopulatedUser } from "@/lib/types/user.types";
import Agency from "@/models/agency.model";
import getTeamMembers from "@/lib/actions/user/get-team-members";


 type Props = {
  params: { agencyId: string };
};
/*
const TeamPage = ({ params }: Props) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL;
        if (!NEXT_PUBLIC_URL) {
          console.warn("NEXT_PUBLIC_URL is not defined");
          setError("Missing API URL");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${NEXT_PUBLIC_URL}/api/users?agencyId=${params.agencyId}`,
          { cache: "no-store" } // Always fetch fresh data
        );

        if (!response.ok) {
          throw new Error("Failed to fetch team members");
        }

        const data = await response.json();
        console.log("Team data:", data)
        setTeamMembers(data);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError("Failed to load team members");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [params.agencyId]);

  if (loading) return <p>Loading team members...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
      }
      modalChildren={<SendInvitation agencyId={params.agencyId} />}
      filterValue="name"
      columns={columns}
      data={teamMembers}
    />
  );
};

export default TeamPage;

 */
/* interface Props {
  params: {
    agencyId: string;
  };
}

interface PopulatedAgency extends AgencyType {
  subAccounts: any[]; // Replace with proper SubAccount type
}

const TeamPage = async ({ params }: Props) => {
  try {
    // Get the current authenticated user
    const authUser = await currentUser();
    
    if (!authUser) {
      return null;
    }

    // Validate agencyId format
    if (!Types.ObjectId.isValid(params.agencyId)) {
      throw new Error('Invalid agency ID format');
    }

    const agencyObjectId = new Types.ObjectId(params.agencyId);

    // Find all team members belonging to the agency
    const teamMembers = await User.find({
      agencyId: agencyObjectId,
    })
    .populate('permissions')
    .populate('subAccounts')
    .lean<PopulatedUser[]>();

    // Find agency details with populated sub-accounts
    const agencyDetails = await Agency.findById(agencyObjectId)
      .populate({
        path: 'subAccounts',
        model: 'SubAccount', // Ensure this matches your SubAccount model name
      })
      .lean<PopulatedAgency>();

    if (!agencyDetails) {
      return null;
    }
 */
    // Return the data (adjust based on your component's needs)
   
   const TeamPage = ({ params }: Props) => {
  const [teamMembers, setTeamMembers] = useState<PopulatedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getTeamMembers(params.agencyId);
      console.log("getTeamMembers data:", data);
      if (data?.teamMembers) setTeamMembers(data.teamMembers);
      setLoading(false);
    })();
  }, [params.agencyId]);

  if (loading) return <p>Loading...</p>;


    return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
      }
      modalChildren={<SendInvitation agencyId={params.agencyId} />}
      filterValue="name"
      columns={columns}
      data={teamMembers}
    />
  );

  }


export default TeamPage;
