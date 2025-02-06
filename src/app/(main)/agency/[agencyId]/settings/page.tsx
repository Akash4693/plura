import AgencyDetails from "@/components/forms/agency-details";
import UserDetails from "@/components/forms/user-details";
import { Agency as AgencyType } from "@/lib/types/agency.types";
import { User as UserType } from "@/lib/types/user.types";
import Agency from "@/models/agency.model";
import User from "@/models/user.model";
import { currentUser } from "@clerk/nextjs";
import React from "react";

type Props = {
  params: { agencyId: string };
};

const SettingsPage = async ({ params }: Props) => {
  const authUser = await currentUser();
  if (!authUser) return null;

  const userDetails = await User.findOne({
    email: authUser.emailAddresses[0]?.emailAddress,
  }).lean() as Partial<UserType>;

  if (!userDetails) return null;

  const agencyDetails = await Agency.findById(params.agencyId)
    .populate("subAccounts")
    .lean() as Partial<AgencyType>;

    if (!agencyDetails) return null;

    const subAccounts = agencyDetails.subAccounts


  return(
    <div className="flex lg:!flex-row flex-col gap-4">
        <AgencyDetails data={agencyDetails} />
        <UserDetails 
            type="agency"
            id={params.agencyId}
            subAccounts={subAccounts}
            userData={userDetails}
        />
    </div>
  ) 
};

export default SettingsPage;

