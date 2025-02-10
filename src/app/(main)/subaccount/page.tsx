import Unauthorized from '@/components/unauthorized';
import { verifyAndAcceptInvitation } from '@/lib/actions/invitation/verify-and-accept-invitation.actions';
import { getAuthUserDetails } from '@/lib/actions/user/get-user-details.actions';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
  searchParams: { state: string; code: string }
}

const SubAccountMainPage = async ({ searchParams }: Props) => {
  const agencyId = await verifyAndAcceptInvitation()

  if (!agencyId) {
    return <Unauthorized />
  }

  const user = await getAuthUserDetails()
  if (!user) return null;

  const getFirstSubaccountWithAccess = user?.Permissions?.find(
    (permission) => permission.access === true
  )

  if (searchParams.state) {
    const statePath = searchParams.state.split("___")[0]
    const stateSubaccountId = searchParams.state.split("___")[1]
    if (!stateSubaccountId) return <Unauthorized />
    return redirect(
      `/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`
    )
  }

  if (getFirstSubaccountWithAccess) {
    return redirect(`/subaccount/${getFirstSubaccountWithAccess.subAccountId}`)
  }

  return (
    <Unauthorized />
  )
}

export default SubAccountMainPage