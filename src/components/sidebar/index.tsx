/*"use client"
import React, { useEffect, useState } from 'react';
import MenuOptions from './menu-options';
import { Permission } from '@/lib/types/permission.types'; // Assuming you have this path
import { getAuthUserDetails } from '@/lib/actions/user/get-user-details.actions';
import { PopulatedUser } from '@/lib/types/user.types';

type Props = {
  id: string;
  type: "agency" | "subaccount";
};


export const Sidebar: React.FC<Props> = ({ id, type }) => {
  console.log('Rendering Sidebar with ID:', id, 'and type:', type);
  const [user, setUser] = useState<PopulatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await getAuthUserDetails();
        setUser(userDetails);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  console.log('User:', user);
  
  if (!user) return null;

  if (!user.Agency) return null;

  const details =
    type === "agency"
      ? user.Agency
      : user.Agency.subAccounts?.find(
          (subaccount) => subaccount._id.toString() === id
        );

        console.log('Sidebar Details:', details);
  if (!details) return null;

  let sideBarLogo = user.Agency.agencyLogo || "/assets/plura-logo.svg";

  if (!user.Agency.whiteLabel && type === "subaccount") {
    // Explicitly typing `subaccount` as `SubAccount`
    const subAccount = user.Agency.subAccounts?.find(
      (subaccount) => subaccount._id.toString() === id
    );
    sideBarLogo = subAccount?.subAccountLogo || user.Agency.agencyLogo;
  }

  const sidebarOpt =
    type === 'agency'
      ? user.Agency.sidebarOption || []
      : details?.sidebarOption || [];

  const subAccounts = user.Agency.subAccounts?.filter(
    (subaccount) =>
      user.Permissions?.some(
        (permission: Permission) =>
          permission.subAccountId?.toString() === subaccount._id.toString() &&
          permission.access
      )
  );



  return (
    <>
      <h1>Menu annan</h1>
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subAccounts || []}
        user={user}
      />
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subAccounts || []}
        user={user}
      />
    </>
  );
};

export default Sidebar;
 */

"use client"
import React, { useEffect, useState } from 'react';
import MenuOptions from './menu-options';
import { Permission } from '@/lib/types/permission.types'; // Assuming you have this path
import { getAuthUserDetails } from '@/lib/actions/user/get-user-details.actions';
import { PopulatedUser } from '@/lib/types/user.types';

type Props = {
  id: string;
  type: "agency" | "subaccount";
  
};

export const Sidebar: React.FC<Props> = ({ id, type }) => {
  const [user, setUser] = useState<PopulatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await getAuthUserDetails();
        setUser(userDetails);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Debugging logs
  console.log('User:', user);
  console.log('User.Agency side:', user?.Agency?.sidebarOption);
  
  
  if (isLoading) {
    return <div>Loading Sidebar...</div>; // Show loading state
  }

  if (!user) return <div>No user found</div>;

  if (!user.Agency) return <div>No agency found for the user</div>;

  const details =
    type === "agency"
      ? user.Agency
      : user.Agency.subAccounts?.find(
          (subaccount) => subaccount._id.toString() === id
        );

  // More Debugging
 

  if (!details) return <div>No details found for this ID</div>;

  let sideBarLogo = user.Agency.agencyLogo;

  if (!user.Agency.whiteLabel && type === "subaccount") {
    const subAccount = user.Agency.subAccounts?.find(
      (subaccount) => subaccount._id.toString() === id
    );
    sideBarLogo = subAccount?.subAccountLogo || user.Agency.agencyLogo;
  }

  const sidebarOpt =
    type === 'agency'
      ? user.Agency.sidebarOption || []
      : details?.sidebarOption || [];

  const subAccounts = user.Agency.subAccounts?.filter(
    (subaccount) =>
      user.Permissions?.some(
        (permission: Permission) =>
          permission.subAccountId?.toString() === subaccount._id.toString() &&
          permission.access
      )
  ) || [];

  console.log("Parent subAccounts:", subAccounts);
console.log("Parent sidebarOpt:", sidebarOpt);
  

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subAccounts || []}
        user={user}
      />
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subAccounts || []}
        user={user}
      />
    </>
  );
};

export default Sidebar;
