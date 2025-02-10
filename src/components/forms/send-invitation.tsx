"use client";
import { Role } from "@/constants/enums/role.enum";
import { useToast } from "@/hooks/use-toast";
import { sendInvitation } from "@/lib/actions/invitation/send-invitation.action";
import { saveActivityLogsNotification } from "@/lib/actions/notification/save-activity-logs-notification.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
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
import { useModal } from "@/providers/modal-provider";

interface SendInvitationProps {
  agencyId: string;
}

const SendInvitation: React.FC<SendInvitationProps> = ({ agencyId }) => {
  const { toast } = useToast();
  const { setClose } = useModal()
  
  const userDataSchema = z.object({
    email: z
      .string()
      .email({ message: "Invalid email address." })
      .min(5, { message: "Email must be at least 5 characters." }),
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
      email: "",
      role: Role.SUBACCOUNT_USER,
    },
  });

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    try {
      const response = await sendInvitation(
        values.role,
        values.email,
        agencyId
      );
      await saveActivityLogsNotification({
        agencyId: agencyId,
        description: `Invited ${response.email}`,
        subAccountId: undefined,
      });
      toast({
        title: "Success",
        description: `Invitation sent to ${response.email} successfully.`,
      });
      setClose()
    } catch (error) {
      console.log("Error sending invitation: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error sending invitation.",
      });
      setClose()
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitation</CardTitle>
        <CardDescription>
          Invite users to your agency. An invitation will be sent to the user.
          Users who already have an invitation send out to their email, will not
          receive another invitation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select user role...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Role.AGENCY_ADMIN}>
                        AGENCY ADMIN
                      </SelectItem>
                      <SelectItem value={Role.SUBACCOUNT_USER}>
                        SUB ACCOUNT USER
                      </SelectItem>
                      <SelectItem value={Role.SUBACCOUNT_GUEST}>
                        SUB ACCOUNT GUEST
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Send Invitation"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SendInvitation;
