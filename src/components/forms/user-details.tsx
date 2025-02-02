"use client"
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
    const getPermissions = async () => {
      try {
        if (!data.user) return;
        const permission = await getUserPermissions(data.user.id);
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

  const onChangePermission = async (
    subAccountId: string,
    val: boolean,
    permissionsId: string | undefined
  ) => {
    if (!data.user?.email) return
    setLoadingPermissions(true)

    const permissionId = permissionsId
  ? new mongoose.Types.ObjectId(permissionsId)
  : new mongoose.Types.ObjectId(); 


    const response = await changeUserPermissions(
      permissionId.toString(),
      data.user.email,
      subAccountId,
      val
    )
    if (type === 'agency') {
        const permission = subAccountPermissions?.Permissions?.find(
          (p) => p.subAccountId.toString() === subAccountId.toString()
        );
      
        if (permission?.SubAccount) {
          await saveActivityLogsNotification({
            agencyId: authUserData?.Agency?.id,
            description: `Gave ${userData?.name} access to | ${permission.SubAccount.name}`,
            subAccountId: permission.SubAccount.id,
          });
        } else {
          console.error("Permission or SubAccount not found for subAccountId:", subAccountId);
        }
      }

    if (response) {
      toast({
        title: 'Success',
        description: 'The request was successfully completed.',
      })
      if (subAccountPermissions) {
        subAccountPermissions?.Permissions?.find((perm) => {
          if (perm.subAccountId.toString() === subAccountId.toString()) {
            return { ...perm, access: !perm.access }
          }
          return perm
        })
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: 'Could not update permissions',
      })
    }
    router.refresh()
    setLoadingPermissions(false)
  }


  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    if (!id) return;
    if (userData || data?.user) {
      const updatedUser = await updateUser(values);
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

      if (updatedUser) {
        toast({
          title: "Success",
          description: "User Information Updated Successfully",
        });
        setClose();
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "Could not update user information. Please try again.",
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
                  <FormLabel>User full name</FormLabel>
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
                    onValueChange={(value) => {
                      if (
                        value === Role.SUBACCOUNT_USER ||
                        value === Role.SUBACCOUNT_GUEST
                      ) {
                        setRoleState(
                          "You must have subaccounts to grant Subaccount access to team members."
                        );
                      } else {
                        setRoleState("");
                      }
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
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
                        Sub account User
                      </SelectItem>
                      <SelectItem value={Role.SUBACCOUNT_GUEST}>
                        Sub account Guest
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
                    const subAccountPermissionsDetails =
                      subAccountPermissions?.Permissions?.find(
                        (p) => p.subAccountId?.toString() === subAccount._id.toString()
                      );
                    return (
                      <div
                        key={subAccount.id}
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
                              subAccount.id,
                              permission,
                              subAccountPermissionsDetails?.id
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
