"use client";
import { Role } from "@/constants/enums/role.enum";
import { useToast } from "@/hooks/use-toast";
import { saveActivityLogsNotification } from "@/lib/actions/notification/save-activity-logs-notification.actions";
import { getAuthUserDetails } from "@/lib/actions/user/get-user-details.actions";
import { getUserPermissions } from "@/lib/actions/user/get-user-permissions.action";
import { updateUser } from "@/lib/actions/user/update-user.action";
import { SubAccount } from "@/lib/types/sub-account.types";
import {
  AuthUserWithAgencySidebarOptionsSubAccounts,
  User,
  UserWithPermissionsAndSubAccounts,
} from "@/lib/types/user.types";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUpload from "../global/file-upload";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import mongoose from "mongoose";
import { changeUserPermissions } from "@/lib/actions/user/change-user-permissions.action";

type Props = {
  id: string | null;
  type: "agency" | "subaccount";
  userData?: Partial<User>;
  subAccounts?: SubAccount[];
};

const UserDetails = ({ id, type, userData, subAccounts }: Props) => {
  const [subAccountPermissions, setSubAccountPermissions] =
    useState<UserWithPermissionsAndSubAccounts | null>(null);
  const { data, setClose } = useModal();
  const [roleState, setRoleState] = useState("");
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [authUserData, setAuthUserData] =
    useState<AuthUserWithAgencySidebarOptionsSubAccounts | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  //console.log( "data in user details", data);
  //Get authUserDetails
  useEffect(() => {
    if (data.user) {
      const fetchDetails = async () => {
        try {
          const response = await getAuthUserDetails();
          if (response) setAuthUserData(response);
        } catch (error) {
          console.error("Error fetching auth user details", error);
        }
      };
      fetchDetails();
    }
  }, [data]);

  console.log("AuthUserData:", authUserData); 
  

  const userDataSchema = z.object({
    name: z
      .string()
      .min(2, { message: "User name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    avatarUrl: z.string().min(1, { message: "User logo is required." }),
    role: z.enum([
      Role.AGENCY_OWNER,
      Role.AGENCY_ADMIN,
      Role.SUBACCOUNT_USER,
      Role.SUBACCOUNT_GUEST,
    ]),
  });

  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    mode: "onChange",
    defaultValues: {
      name: userData ? userData.name : data?.user?.name,
      email: userData ? userData.email : data?.user?.email,
      avatarUrl: userData ? userData.avatarUrl : data?.user?.avatarUrl,
      role: userData ? userData.role : data?.user?.role,
    },
  });

  useEffect(() => {
    if (!data.user) return;
    console.log("data in user details: ", data.user)
    const getPermissions = async () => {
      try {
        console.log("Fetching permissions for user:", data.user);
        if (!data.user) return;
        const permission = await getUserPermissions(data.user._id.toString());
      console.log("Fetched permissions:", permission);
        setSubAccountPermissions(permission);
      } catch (error) {
        console.error("Error fetching user permissions", error);
      }
    };
    getPermissions();
  }, [data, form]);

  useEffect(() => {
    if (data.user) {
      form.reset(data.user);
    }
    if (userData) {
      form.reset(userData);
    }
  }, [userData, data]);

  const role = form.watch("role"); // Watch role field

  useEffect(() => {
    if (role === Role.SUBACCOUNT_USER || role === Role.SUBACCOUNT_GUEST) {
      setRoleState(
        "You must have subaccounts to grant Subaccount access to team members."
      );
    } else {
      setRoleState("");
    }
  }, [role]);
  
  console.log("subAccountPermissions:", subAccountPermissions)
  
  const onChangePermission = async (
    subAccountId: string,
    value: boolean,
    permissionsId: string | undefined
  ) => {
    console.log("onChangeParameter", subAccountId, value, permissionsId)
    if (!data.user?.email) return;
    setLoadingPermissions(true);

    //  const permissionId = permissionsId
    //   /* ? */ new mongoose.Types.ObjectId(permissionsId)
    //   : new mongoose.Types.ObjectId(); 

      console.log("permissionsId: ", permissionsId?.toString())

    const response = await changeUserPermissions(
      permissionsId?.toString(),
      data.user.email,
      subAccountId,
      value
    );
    //console.log("response => ", response)
    if (type === "agency") {
      const permission = subAccountPermissions?.permissions?.find(
        (p) => p.SubAccount._id.toString() === subAccountId.toString()
      );
      console.log("permission => ", permission);
      if (permission?.SubAccount) {
        await saveActivityLogsNotification({
          agencyId: authUserData?.Agency?._id,
          description: `Gave ${userData?.name} access to | ${permission.SubAccount.name}`,
          subAccountId: permission.SubAccount._id.toString(),
        });
      } else {
        console.error(
          "Permission or SubAccount not found for subAccountId:",
          subAccountId
        );
      }
    }

    if (response) {
      toast({
        title: "Success",
        description: "The request was successfully completed.",
      });
      if (subAccountPermissions) {
        subAccountPermissions?.Permissions?.find((perm) => {
          if (perm.subAccountId.toString() === subAccountId.toString()) {
            return { ...perm, access: !perm.access };
          }
          return perm;
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not update permissions",
      });
    }
    router.refresh();
    setLoadingPermissions(false);
  };

  //console.log("On change permission ", onChangePermission);

  const onSubmit = async (value: z.infer<typeof userDataSchema>) => {
    if (!id) return null;

    const values = form.getValues();

    console.log("values:", values);

    if (userData || data?.user) {
      try {
        // Call the API to update the user
        const response = await fetch("/api/update-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values), // Pass user data to API
        });

        const result = await response.json(); // Parse the JSON response

        console.log("result:", result);
        if (response.ok) {
          // On success, save activity log and update UI
          authUserData?.Agency?.subAccounts
            ?.filter((subAccount) =>
              authUserData?.Permissions?.some(
                (permission) =>
                  permission.subAccountId === subAccount.id && permission.access
              )
            )
            .forEach(async (subAccount) => {
              await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Updated ${userData?.name} information`,
                subAccountId: subAccount.id,
              });
            });

          toast({
            title: "Success",
            description: "User Information Updated Successfully",
          });
          setClose();
          router.refresh();
        } else {
          // Handle failure with result.message
          toast({
            variant: "destructive",
            title: "Update Failed",
            description:
              result.message ||
              "Could not update user information. Please try again.",
          });
        }
      } catch (error) {
        console.error("Error updating user:", error);
        toast({
          variant: "destructive",
          title: "Update Failed",
          description:
            "An error occurred while updating the user. Please try again.",
        });
      }
    } else {
      console.log("Error: User information submission failed.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Add or update information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile pic</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="avatar"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input required placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={
                        userData?.role === "AGENCY_OWNER" ||
                        form.formState.isSubmitting
                      }
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User role</FormLabel>
                  <Select
                    disabled={field.value === Role.AGENCY_OWNER}
                    onValueChange={field.onChange} // ✅ No setState here
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Role.AGENCY_ADMIN}>
                        Agency Admin
                      </SelectItem>
                      {(data?.user?.role === Role.AGENCY_OWNER ||
                        userData?.role === Role.AGENCY_OWNER) && (
                        <SelectItem value={Role.AGENCY_OWNER}>
                          Agency Owner
                        </SelectItem>
                      )}
                      <SelectItem value={Role.SUBACCOUNT_USER}>
                        Subaccount User
                      </SelectItem>
                      <SelectItem value={Role.SUBACCOUNT_GUEST}>
                        Subaccount Guest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground">{roleState}</p>
                </FormItem>
              )}
            />

            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Save user details"}
            </Button>
            {authUserData?.role === Role.AGENCY_OWNER && (
              <div>
                <Separator className="my-4" />
                <FormLabel>User permissions</FormLabel>
                <FormDescription className="mb-4">
                  Enable access control to grant Sub Account access to team
                  members. Available to agency owners
                </FormDescription>
                <div className="flex flex-col gap-4">
                  {subAccounts?.map((subAccount) => {
                    console.log("Enable subAccount:", subAccounts)
                    const subAccountPermissionsDetails =
                      subAccountPermissions?.permissions?.find(
                        (p) =>
                          p.subAccountId?.toString() ===
                          subAccount._id.toString()
                      );
                      console.log("SubAccountId:", subAccountPermissionsDetails);
                    return (
                      <div
                        key={subAccount._id.toString()}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p>{subAccount.name}</p>
                        </div>
                        <Switch
                          disabled={loadingPermissions}
                          checked={subAccountPermissionsDetails?.access}
                          onCheckedChange={(permission) => {
                            onChangePermission(
                              subAccount._id.toString(),
                              permission,
                              subAccountPermissionsDetails?._id.toString()
                            );
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
