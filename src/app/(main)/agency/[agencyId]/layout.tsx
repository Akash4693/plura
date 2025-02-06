

import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { verifyAndAcceptInvitation } from '@/lib/actions/invitation/verify-and-accept-invitation.actions'
import { getNotificationAndUser } from '@/lib/actions/notification/get-notification-and-user.action'
import { NotificationWithUser } from '@/lib/types/notification.types'
import { Role } from '@/constants/enums/role.enum'
import Unauthorized from '@/components/unauthorized'
import Sidebar from '@/components/sidebar'
import BlurPage from '@/components/global/blur-page'
import InfoBar from '@/components/global/infobar'


type Props = {
     children: React.ReactNode
     params: { agencyId: string }
}

const layout = async ({children, params}: Props) => {
   const agencyId = await verifyAndAcceptInvitation()
    const user = await currentUser();

    if (!user) {
        return redirect("/")
    }
    if (!agencyId) {
        return redirect("/agency")
    } 

    if (
        user.privateMetadata.role !== Role.AGENCY_OWNER && 
        user.privateMetadata.role !== Role.AGENCY_ADMIN
    )
    return <Unauthorized />

    let allNotifications: NotificationWithUser[] = [];
    const notifications = await getNotificationAndUser(agencyId.toString())
    if (notifications) allNotifications = notifications
     
   // console.log("allNotifications", allNotifications)
   // console.log("notifications", notifications)
 // const sidebar = await Sidebar({ id: params.agencyId, type: "agency" });

  return (
    <div className="h-screen overflow-hidden">
        <Sidebar
        id={params.agencyId}
        type="agency"
    
        />
      <div className="md:pl-[300px]">
        <InfoBar 
          notifications={allNotifications}
          role={allNotifications[0]?.user?.role}
        />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  )
}

export default layout