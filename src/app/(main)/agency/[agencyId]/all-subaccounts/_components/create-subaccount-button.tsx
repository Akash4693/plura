"use client"
import SubAccountDetails from '@/components/forms/subaccount-details'
import CustomModal from '@/components/global/custom-model'
import { Button } from '@/components/ui/button'
import { AgencySidebarOption } from '@/lib/types/agency-sidebar-option.types'
import { Agency } from '@/lib/types/agency.types'
import { SubAccount } from '@/lib/types/sub-account.types'
import { PopulatedUser } from '@/lib/types/user.types'
import { useModal } from '@/providers/modal-provider'
import { PlusCircleIcon } from 'lucide-react'
import React from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
    user: PopulatedUser & {
      Agency?: Agency & {
        subAccounts?: SubAccount[];
        sidebarOption?: AgencySidebarOption[];
      } | null;
    };
    id: string;
    className: string;
  };
  

const CreateSubaccountButton = ({ user, id, className }: Props) => {
    const { setOpen } = useModal()
    const agencyDetails = user.Agency 

    if (!agencyDetails) return null;

    console.log("sub user id:", user)

  return (
    <Button
        className={twMerge("w-full flexibility gap-4", className)}
        onClick={() => {
            setOpen(
            <CustomModal
                title="Create Sub account"
                subheading="Switch between organizations"
            >
                <SubAccountDetails 
                    agencyDetails={agencyDetails}
                    userId={user.id}
                    userName={user.name}
                />
            </CustomModal>
            )
        }}
    >
        <PlusCircleIcon size={15} />
        Create Sub account
    </Button>
  )
}

export default CreateSubaccountButton