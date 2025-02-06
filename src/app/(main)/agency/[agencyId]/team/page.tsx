import { PopulatedUser } from "@/lib/types/user.types";
import Agency from "@/models/agency.model";
import User from "@/models/user.model";
import { currentUser } from "@clerk/nextjs";
import React from "react";
import DataTable from "./data-table";
import { Plus } from "lucide-react";

type Props = {
  params: { agencyId: string };
};

const TeamPage = async ({ params }: Props) => {
  const authUser = await currentUser()
  const teamMembers = await User.find({
    agencyId: params.agencyId,
  })
    .populate({
      path: "agencyId",
      model: "Agency",
      populate: { path: "subAccounts" },
    })
    .populate({
      path: "permissions",
      model: "Permissions",
      populate: { path: "subAccount" },
    })
    .lean()
    .exec();

  if (!authUser) return null;

  const agencyDetails = await Agency.findOne({
    _id: params.agencyId,
  })
    .populate("subAccounts")
    .exec();

  if(!agencyDetails) return null;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add 
        </>
      }
      modalChildren={<></>}
      filterValue="name"
      columns={column}
      data={teamMembers}
    >

    </DataTable>
  );
};

export default TeamPage;
