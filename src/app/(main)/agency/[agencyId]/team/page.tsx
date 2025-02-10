"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import DataTable from "./data-table";
import { columns } from "./columns";
import SendInvitation from "@/components/forms/send-invitation";

type Props = {
  params: { agencyId: string };
};

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
