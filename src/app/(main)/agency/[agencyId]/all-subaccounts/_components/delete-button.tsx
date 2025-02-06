"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { saveActivityLogsNotification } from '@/lib/actions/notification/save-activity-logs-notification.actions'
import { deleteSubaccount } from '@/lib/actions/sub-account/delete-subaccount.action'
import { getSubaccountDetails } from '@/lib/actions/sub-account/get-subaccount-details.action'

type Props = {
    subaccountId: string
}

const DeleteButton = ({ subaccountId }: Props) => {
  const router = useRouter()
  
    return (
    <div
      onClick={async () => {
        const response = await getSubaccountDetails(subaccountId)
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Deleted a subaccount | ${response?.name}`,
          subAccountId: subaccountId,
        })
        await deleteSubaccount(subaccountId)
        router.refresh()
      }}
    >
      Delete
    </div>
  )
}

export default DeleteButton