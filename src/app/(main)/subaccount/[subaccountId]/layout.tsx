import InfoBar from "@/components/global/infobar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import { Role } from "@/constants/enums/role.enum";
import { verifyAndAcceptInvitation } from "@/lib/actions/invitation/verify-and-accept-invitation.actions";
import { getNotificationAndUser } from "@/lib/actions/notification/get-notification-and-user.action";
import { getAuthUserDetails } from "@/lib/actions/user/get-user-details.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: { subaccountId: string };
};

const SubaccountLayout = async ({ children, params }: Props) => {
  const agencyId = await verifyAndAcceptInvitation();
  if (!agencyId) return <Unauthorized />;

  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }

  let notifications: any = [];
  
  console.log("params.subAccountId:", params.subaccountId)

  if (!user.privateMetadata.role) {
    return <Unauthorized />;
  } else {
    const allPermissions = await getAuthUserDetails();
   // console.log("allPermissions: ", allPermissions?.Permissions)
    
    const hasPermission = allPermissions?.permissions?.find(
      (permission) =>
        permission.access &&
        permission.subAccountId?._id?.toString() === params.subaccountId
    ); 

   // console.log("hasPermission", hasPermission)

    if (!hasPermission) {
      return <Unauthorized />;
    }

    const allNotifications = await getNotificationAndUser(agencyId);

    if (
      user.privateMetadata.role === Role.AGENCY_ADMIN ||
      user.privateMetadata.role === Role.AGENCY_OWNER
    ) {
      notifications = allNotifications;
    } else {
      const filteredNotifications = allNotifications?.filter(
        (item) => item?.subAccountId?.toString() === params.subaccountId
      );
      if (filteredNotifications) notifications = filteredNotifications;
    }
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.subaccountId} type="subaccount" />

      <div className="md:pl-[300px]">
        <InfoBar
          notifications={notifications}
          role={user.privateMetadata.role as Role}
          subAccountId={params.subaccountId as string}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export default SubaccountLayout;
