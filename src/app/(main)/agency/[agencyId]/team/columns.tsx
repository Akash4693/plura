"use client"

import UserDetails from "@/components/forms/user-details";
import CustomModal from "@/components/global/custom-model";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Role } from "@/constants/enums/role.enum";
import { useToast } from "@/hooks/use-toast";
import { deleteUser } from "@/lib/actions/user/delete-user.action";
import { getUser } from "@/lib/actions/user/get-user.action";

import { UsersWithAgencySubAccountPermissionsSidebarOptions } from "@/lib/types/user.types";
import { useModal } from "@/providers/modal-provider";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";


import { useState } from "react";


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
            const role = row.getValue("role") as Role;
            const isAgencyOwner = role === Role.AGENCY_OWNER;
            const permissions = row.original?.Permissions || []; // Ensure Permissions is an array
            const ownedAccounts = permissions.filter(per => per.access && per.SubAccount);

            console.log("Row Data:", row.original);

            if (isAgencyOwner) 
                return (
                   <div className="flex flex-col items-start">
                    <div className="flex flex-col gap-2">
                    <Badge className="bg-slate-600 whitespace-nowrap">
                      Agency -  {row?.original?.Agency?.name}
                    </Badge>
                    </div>
                   </div> 
            )
            console.log("Owned Accounts:", ownedAccounts);
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
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.getValue("role") as Role //Check for role issue
            return (
                <Badge
                    className={clsx({
                        "bg-emerald-500": role === Role.AGENCY_OWNER,
                        "bg-orange-400": role === Role.AGENCY_ADMIN,
                        "bg-primary/20": role === Role.SUBACCOUNT_USER,
                        "bg-muted": role === Role.SUBACCOUNT_GUEST,
                    })}
                >
                    {role}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const rowData = row.original
            console.log("Row Actions Data:", rowData); 
            return <CellActions rowData={rowData} />
        },
    },
]

interface CellActionsProps {
    rowData: UsersWithAgencySubAccountPermissionsSidebarOptions
}


const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
    const { data, setOpen } = useModal()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    console.log("rowData", rowData)
    if (!rowData) return null
    console.log("rowData agency", rowData.Agency)
    if (!rowData?.Agency) return null

    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                    >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        className="flex gap-2"
                        onClick={() => navigator.clipboard.writeText(rowData?.email)}
                    >
                        <Copy size={15} /> Copy Email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="flex gap-2"
                        onClick={() => {
                            setOpen(
                                <CustomModal
                                    title="Edit user details"
                                    subheading="You can change permissions only when the user has an owned sub account"
                                >
                                    <UserDetails 
                                        type="agency"
                                        id={rowData?.Agency?._id.toString() || null}
                                        subAccounts={rowData?.Agency?.subAccounts}
                                    />
                                </CustomModal>,
                                async () => {
                                    return { user: await getUser(rowData?._id.toString()) }
                                }
                            )
                        }}
                    >
                        <Edit size={15} />
                        Edit Details
                    </DropdownMenuItem>
                    {rowData.role === Role.AGENCY_OWNER && (
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                className="flex gap-2"
                                onClick={() => {}}
                            >
                                <Trash size={15} />Remove User
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-left">
                        Remove User
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                    This User and all  data related to the
                    account will be deleted permanently.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel className="mb-2">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={loading}
                        className="mb-2  hover:bg-primary/80"
                        
                        onClick={async () => {
                            try {
                                setLoading(true);
                                console.log("id deleted :", rowData._id)
                                await deleteUser(rowData?._id.toString());
            
                                toast({
                                    title: "User Deleted",
                                    description: "The user and all related data have been removed.",
                                });
            
                                router.refresh();
                            } catch (error) {
                                console.error("Error deleting user:", error);
                                toast({
                                    title: "Error",
                                    description: "Failed to delete user. Please try again.",
                                    variant: "destructive",
                                });
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

}