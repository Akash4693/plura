import SubAccountDetails from '@/components/forms/subaccount-details';
import UserDetails from '@/components/forms/user-details';
import BlurPage from '@/components/global/blur-page';
import Agency from '@/models/agency.model';
import SubAccount from '@/models/sub-account.model';
import User from '@/models/user.model';
import { currentUser } from '@clerk/nextjs';
import React from 'react'

type Props = {
    params: { subaccountId: string }
}

const SubaccountSettingPage = async ({ params }: Props) => {
    const authUser = await currentUser();
    if (!authUser) return;

    const userDetails = await User.findOne({ email: authUser.emailAddresses[0].emailAddress }).exec()

    if (!userDetails) return; 

    const subAccount = await SubAccount.findById(params.subaccountId)

    if (!subAccount) return null

    const agencyDetails = await Agency.findById(subAccount.agencyId)
    .populate({
        path: "subAccounts",
        model: "SubAccount"
    }).lean()
      .exec()

    if (!agencyDetails) return
    
    const subAccounts = agencyDetails.subAccounts

  return (
    <BlurPage>
        <div className="flex lg:!flex-row flex-col gap-4">
            <SubAccountDetails 
                agencyDetails={agencyDetails}
                details={subAccount}
                userId={userDetails._id.toString()}
                userName={userDetails.name}
            />
            <UserDetails 
                type="subaccount"
                id={params.subaccountId}
                subAccounts={subAccounts}
                userData={userDetails}
            />
        </div>
    </BlurPage>
  )
}

export default SubaccountSettingPage