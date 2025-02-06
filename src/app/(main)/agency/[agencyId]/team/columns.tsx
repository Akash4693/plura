"use client"


import { Badge } from "@/components/ui/badge";
import { Role } from "@/constants/enums/role.enum";
import { UsersWithAgencySubAccountPermissionsSidebarOptions } from "@/lib/types/user.types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";


export const columns:
ColumnDef<UsersWithAgencySubAccountPermissionsSidebarOptions>[] =
[
    {
        accessorKey: "id",
        header: "",
        cell: () => {
            return null
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const avatarUrl = row.getValue("avatarUrl") as string
            return (
                <div className="flex items-center gap-4">
                    <div className="h-11 w-11 relative flex-none">
                        <Image 
                            src={avatarUrl}
                            fill
                            className="rounded-full object-cover"
                            alt="avatar image"
                        />
                    </div>
                    <span>{row.getValue("name")}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "avatarUrl",
        header: "",
        cell: () => {
            return null
        },
    },
    { accessorKey: "email", header: "Email" },

    {
        accessorKey: "SubAccount",
        header: "Owned Accounts",
        cell: ({ row }) => {
            const isAgencyOwner = row.getValue("row") === Role.AGENCY_OWNER
            const ownedAccounts = row.original?.Permissions?.filter(
                (per) => per.access
            )

            if (isAgencyOwner) 
                return (
                   <div className="flex flex-col items-start">
                    <div className="flex flex-col gap-2">
                    <Badge className="bg-slate-600 whitespace-nowrap">
                        Agency - {row?.original?.Agency?.name}
                    </Badge>
                    </div>
                   </div> 
            )
                return (
                   <div className="flex flex-col items-start">
                    <div className="flex flex-col gap-2">
                        {ownedAccounts?.length ? (
                            ownedAccounts.map((account) => (
                                <Badge key={account.id} className="bg-slate-600 w-fit whitespace-nowrap">
                        Sub Account - {account.SubAccount?.name}
                    </Badge>
                        )) 
                    ): (
                      <div className="text-muted-foreground">
                        No Access Yet
                      </div>  
                    )}
                    
                    </div>
                   </div> 
            )
        },
    },

]