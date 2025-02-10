import AgencyDetails from "@/components/forms/agency-details";
import { Role } from "@/constants/enums/role.enum";
import { SubscriptionPlan } from "@/constants/enums/subscription-plan.enum";
import { verifyAndAcceptInvitation } from "@/lib/actions/invitation/verify-and-accept-invitation.actions";
import { getAuthUserDetails } from "@/lib/actions/user/get-user-details.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({
  searchParams,
}: {
  searchParams: { plan: SubscriptionPlan; state: string; code: string }
}) => {
  const agencyId = await verifyAndAcceptInvitation()
  console.log("agencyId:", agencyId)

  //get the users details
  const user = await getAuthUserDetails()

  console.log("user await getUserDetails", user)
  
  if (agencyId) {
    console.log("agencyId: " , agencyId)
    if (user?.role === Role.SUBACCOUNT_GUEST || user?.role === Role.SUBACCOUNT_USER) {
      return redirect('/subaccount')
    } else if (user?.role === Role.AGENCY_OWNER || user?.role === Role.AGENCY_ADMIN) {    
      if (searchParams.plan) {
        return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`)
      }
      if (searchParams.state) {
        const statePath = searchParams.state.split('___')[0]
        const stateAgencyId = searchParams.state.split('___')[1]
        if (!stateAgencyId) return <div>Not authorized</div>
        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
        )
      } else return redirect(`/agency/${agencyId}`)
    } else {
      return <div>Not authorized</div>
    }
  }
  const authUser = await currentUser();


  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
        <h1 className="text-4xl">Create An Agency</h1>
        <AgencyDetails 
          data={{
            companyEmail: authUser?.emailAddresses[0].emailAddress || ""
          }}
        />
      </div>
    </div>
  )
};

export default Page; 

/* import { ObjectId } from "mongodb";
import AgencyDetails from "@/components/forms/agency-details";
import { Role } from "@/constants/enums/role.enum";
import { SubscriptionPlan } from "@/constants/enums/subscription-plan.enum";
import { verifyAndAcceptInvitation } from "@/lib/actions/invitation/verify-and-accept-invitation.actions";
import { getAuthUserDetails } from "@/lib/actions/user/get-user-details.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({
  searchParams,
}: {
  searchParams: { plan: SubscriptionPlan; state: string; code: string };
}) => {
  try {
    // Step 1: Verify and accept invitation
    let agencyId: string | null;
    try {
      const result = await verifyAndAcceptInvitation();
      agencyId = result instanceof ObjectId ? result.toString() : result;
      console.log("Verified agencyId:", agencyId);
    } catch (error) {
      console.error("Failed to verify and accept invitation:", error);
      return (
        <div>Error: Unable to process invitation. Please try again later.</div>
      );
    }

    // Step 2: Get user details
    let user = null;
    try {
      user = await getAuthUserDetails();
      console.log("Retrieved user details:", user);
    } catch (error) {
      console.error("Failed to retrieve user details:", error);
      return (
        <div>
          Error: Unable to retrieve user information. Please try again later.
        </div>
      );
    }

    // Step 3: Handle redirection logic based on user role and searchParams
    if (agencyId) {
      if (
        user?.role === Role.SUBACCOUNT_GUEST ||
        user?.role === Role.SUBACCOUNT_USER
      ) {
        return redirect("/subaccount");
      }

      if (
        user?.role === Role.AGENCY_OWNER ||
        user?.role === Role.AGENCY_ADMIN
      ) {
        if (searchParams.plan) {
          return redirect(
            `/agency/${agencyId}/billing?plan=${searchParams.plan}`
          );
        }

        if (searchParams.state) {
          const [statePath, stateAgencyId] = searchParams.state.split("___");
          if (!stateAgencyId) {
            return <div>Error: Missing state agencyId.</div>;
          }

          return redirect(
            `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
          );
        }

        return redirect(`/agency/${agencyId}`);
      }

      return <div>Error: User is not authorized.</div>;
    }

    // Step 4: Render AgencyDetails form if no redirection
    try {
      const authUser = await currentUser();
      if (!authUser) {
        console.error("Failed to retrieve authenticated user");
        return <div>Error: Unable to retrieve user information.</div>;
      }

      console.log("Authenticated user:", authUser);

      return (
        <div className="flex justify-center items-center mt-4">
          <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
            <h1 className="text-4xl">Create An Agency</h1>
            <AgencyDetails
              data={{
                companyEmail: authUser.emailAddresses?.[0]?.emailAddress || "",
              }}
            />
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error rendering AgencyDetails form:", error);
      return <div>Error: Unable to load the form. Please try again later.</div>;
    }
  } catch (error) {
    console.error("Unexpected error occurred in Page component:", error);
    return (
      <div>Unexpected error: Something went wrong. Please try again later.</div>
    );
  }
};

export default Page;
 */