// src/app/(main)/agency/[agencyId]/all-subaccounts/subaccounts-list.tsx
"use client";

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
import { SubAccount } from "@/lib/types/sub-account.types";
import Image from "next/image";
import Link from "next/link";
import {  PopulatedUser, UserWithPermissionsAndSubAccounts } from "@/lib/types/user.types";
import CreateSubaccountButton from "./create-subaccount-button";
import DeleteButton from "./delete-button";
import { Agency } from "@/lib/types/agency.types";
import { AgencySidebarOption } from "@/lib/types/agency-sidebar-option.types";

type Props = {
    user: PopulatedUser & {
        Agency?: Agency & {
          subAccounts?: SubAccount[];
          sidebarOption?: AgencySidebarOption[];
        } | null;
      };
  agencyId: string;
};

const SubaccountsList = ({ user, agencyId }: Props) => {
  return (
    <AlertDialog>
      <div className="flex flex-col">
        <CreateSubaccountButton
          user={user}
          id={agencyId}
          className="w-[200px] self-end m-6"
        /> 

        <Command className="rounded-lg bg-transparent">
          <CommandInput placeholder="Search Account..." />
          <CommandList>
            <CommandEmpty>No Results found.</CommandEmpty>
            <CommandGroup heading="Sub Accounts">
              {user?.Agency?.subAccounts?.length ? (
                user.Agency.subAccounts.map((subaccount: SubAccount) => {

                  return (
                  <CommandItem
                    key={subaccount._id.toString()}
                    className="h-32 !bg-background my-2 text-primary border-1[px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                  >
                    <Link
                      href={`/subaccount/${subaccount._id}`}
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
                        <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive">
                          <DeleteButton subaccountId={subaccount._id.toString()} />
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

export default SubaccountsList;
