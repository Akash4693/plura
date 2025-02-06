/* 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getAuthUserDetails } from "@/lib/actions/user/get-user-details.actions";
import { SubAccount } from "@/lib/types/sub-account.types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DeleteButton from "./_components/delete-button";
import { AuthUserWithAgencySidebarOptionsSubAccounts } from "@/lib/types/user.types";
import CreateSubaccountButton from "./_components/create-subaccount-button";

type Props = {
  params: { agencyId: string };
};

const AllSubaccountsPage = async ({ params }: Props) => {
 
  const user = await getAuthUserDetails();
  
  const user = async () => {
    const dataRetrieve = await getAuthUserDetails();
    return dataRetrieve;
  };
  useEffect(() => {
    user();
  }, []);

  console.log("all sub user", user)
  if (!user) return null; 

  return (
    <AlertDialog>
      <div className="flex flex-col">
      <CreateSubaccountButton 
          user={user}
          id={params.agencyId}
          className="w-[200px] self-end m-6"
        />
       
        <Command className="rounded-lg bg-transparent">
          <CommandInput placeholder="Search Account..." />
          <CommandList>
            <CommandEmpty>No Results found.</CommandEmpty>
            <CommandGroup heading="Sub Accounts">
            {user?.Agency && user.Agency?.subAccounts?.length ? (
                user.Agency?.subAccounts.map((subaccount: SubAccount) => {
                  console.log("Rendering User:", user);
                  console.log("Rendering Agency:",user.Agency);
                  console.log("Rendering Agency subAccounts:",user.Agency?.subAccounts);
                  console.log("Rendering SubAccount:", subaccount);
                  console.log("Rendering SubAccount_id:", subaccount._id);
                  return (
                  <CommandItem
                    key={subaccount.id}
                    className="h-32 !bg-background my-2 text-primary border-1[px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                  >
                    <Link
                      href={`/subaccount/${subaccount.id}`}
                      className="flex gap-4 w-full h-full"
                    >
                      <div className="relative w-32">
                        <Image
                          src={subaccount.subAccountLogo as string}
                          alt="subaccount logo"
                          fill
                          className="rounded-md object-contain bg-muted/50 p-4"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="flex flex-col">
                          {subaccount.name}
                          <span className="text-muted-foreground text-xs">
                            {subaccount.address}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant={"destructive"}
                        className="text-red-600 w-20 hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-left">
                          Delete this sub account.
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-left">
                          This sub account and all data related to the sub
                          account will be deleted permanently.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex items-center">
                        <AlertDialogCancel className="mb-2">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive">
                          <DeleteButton subaccountId={subaccount.id} />
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </CommandItem>
                  )
                })
              ) : (
                <div className="text-muted-foreground text-center p-4">
                  No Sub accounts
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </AlertDialog>
  );
};

export default AllSubaccountsPage;
 */

/* "use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getAuthUserDetails } from "@/lib/actions/user/get-user-details.actions";
import { SubAccount } from "@/lib/types/sub-account.types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DeleteButton from "./_components/delete-button";
import { AuthUserWithAgencySidebarOptionsSubAccounts } from "@/lib/types/user.types";
import CreateSubaccountButton from "./_components/create-subaccount-button";

type Props = {
  params: { agencyId: string };
};

const AllSubaccountsPage: React.FC<Props> = ({ params }: Props) => {
  const [user, setUser] = useState<AuthUserWithAgencySidebarOptionsSubAccounts | null>(null);
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

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>No user data available</div>;

  return (
    <AlertDialog>
      <div className="flex flex-col">
        <CreateSubaccountButton
          user={user}
          id={params.agencyId}
          className="w-[200px] self-end m-6"
        />

        <Command className="rounded-lg bg-transparent">
          <CommandInput placeholder="Search Account..." />
          <CommandList>
            <CommandEmpty>No Results found.</CommandEmpty>
            <CommandGroup heading="Sub Accounts">
              {user?.Agency && user.Agency?.subAccounts?.length ? (
                user.Agency.subAccounts.map((subaccount: SubAccount) => (
                  <CommandItem
                    key={subaccount.id}
                    className="h-32 !bg-background my-2 text-primary border-1[px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                  >
                    <Link
                      href={`/subaccount/${subaccount.id}`}
                      className="flex gap-4 w-full h-full"
                    >
                      <div className="relative w-32">
                        <Image
                          src={subaccount.subAccountLogo as string}
                          alt="subaccount logo"
                          fill
                          className="rounded-md object-contain bg-muted/50 p-4"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="flex flex-col">
                          {subaccount.name}
                          <span className="text-muted-foreground text-xs">
                            {subaccount.address}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="text-red-600 w-20 hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-left">
                          Delete this sub account.
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-left">
                          This sub account and all data related to the sub
                          account will be deleted permanently.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex items-center">
                        <AlertDialogCancel className="mb-2">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive">
                          <DeleteButton subaccountId={subaccount.id} />
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </CommandItem>
                ))
              ) : (
                <div className="text-muted-foreground text-center p-4">
                  No Sub accounts
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </AlertDialog>
  );
};

export default AllSubaccountsPage;
 */


import { getAuthUserDetails } from "@/lib/actions/user/get-user-details.actions";
import { Suspense } from "react";
import SubaccountsList from "./_components/client-subaccount-list";


type Props = {
  params: { agencyId: string };
};

const AllSubaccountsPage = async ({ params }: Props) => {
  const user = await getAuthUserDetails();

  if (!user) return null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubaccountsList user={user} agencyId={params.agencyId} />
    </Suspense>
  );
};

export default AllSubaccountsPage;
