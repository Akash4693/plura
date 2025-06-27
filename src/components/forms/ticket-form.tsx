"use client";

import { useToast } from "@/hooks/use-toast";
import { searchContacts } from "@/lib/actions/contact/search-contacts-action";
import { saveActivityLogsNotification } from "@/lib/actions/notification/save-activity-logs-notification.actions";
import { getSubAccountTeamMembers } from "@/lib/actions/sub-account/get-subaccount-team-members-action";
import { upsertTicket } from "@/lib/actions/ticket/upsert-ticket-action";
import { Contact } from "@/lib/types/contact.types";
import { Tag } from "@/lib/types/tag.types";
import { TicketWithTags } from "@/lib/types/ticket.types";
import { User } from "@/lib/types/user.types";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckIcon, ChevronsUpDownIcon, User2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { cn } from "@/lib/utils/classNames";
import Loading from "../global/loading";
import TagCreator from "../global/tag-creator";

type Props = {
  laneId: string;
  subaccountId: string;
  getNewTicket: (ticket: TicketWithTags) => void;
};

const currencyNumberRegex = /^\d+(\.\d{1,2})?$/;

const TicketFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  value: z.string().refine((value) => currencyNumberRegex.test(value), {
    message: "Value must be a valid price.",
  }),
});

const TicketForm = ({ laneId, subaccountId, getNewTicket }: Props) => {
  const { data: defaultData, setClose } = useModal();
  const router = useRouter();
  const { toast } = useToast();
  const [tags, setTags] = useState<Tag[]>([]);
  const [contact, setContact] = useState("");
  const [search, setSearch] = useState("");
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [allTeamMembers, setAllTeamMembers] = useState<User[]>([]);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [assignedTo, setAssignedTo] = useState(
    defaultData.ticket?.assignedUserId?._id || ""
  );

  const form = useForm<z.infer<typeof TicketFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(TicketFormSchema),
    defaultValues: {
      name: defaultData.ticket?.name || "",
      description: defaultData.ticket?.description || "",
      value: String(defaultData.ticket?.value || 0),
    },
  });
  const isLoading = form.formState.isLoading;

  
  useEffect(() => {
  let isMounted = true; // Prevent state updates if component unmounts
  
  if (subaccountId) {
    const fetchData = async () => {
      try {
        const response = await getSubAccountTeamMembers(subaccountId);
        if (isMounted && response) {
          setAllTeamMembers(response);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
        if (isMounted) {
          setAllTeamMembers([]);
        }
      }
    };
    
    fetchData();
  }
  
  return () => {
    isMounted = false; // Cleanup
  };
}, [subaccountId]); 

  useEffect(() => {
    if (defaultData.ticket) {
      form.reset({
        name: defaultData.ticket.name || "",
        description: defaultData.ticket?.description || "",
        value: String(defaultData.ticket?.value || 0),
      });
    
      if (defaultData.ticket.customerId) {
        const customerId =
          typeof defaultData.ticket.customerId === "object"
            ? defaultData.ticket.customerId._id
            : defaultData.ticket.customerId;
        setContact(customerId.toString());
      }
      const fetchData = async () => {
        const response = await searchContacts(
          defaultData.ticket?.customerId?.name || ""
        );
        setContactList(response);
      };
      fetchData();
    }
  }, [defaultData]);

  /*    values: String(
    (typeof defaultData.ticket.value === "object" &&
     defaultData.ticket.value !== null &&
     "$numberDecimal" in defaultData.ticket.value)
      ? (defaultData.ticket.value as any).$numberDecimal
      : defaultData.ticket.value ?? 0
  ), */

  const onSubmit = async (values: z.infer<typeof TicketFormSchema>) => {
    if (!laneId) return;
    try {
     //const numericValue = parseFloat(values.values);
      console.log("default data of ticket", defaultData.ticket)
      

    console.log("📝 Ticket Form Values:", values);

      const response = await upsertTicket(
        {
          ...values,
          laneId,
          _id: defaultData.ticket?._id,
          assignedUserId: assignedTo,
          ...(contact ? { customerId: contact } : {}),
        },
        tags
      );
      console.log("selected tags: ", tags)
      console.log("Upsert Ticket response: ", response)
      


      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Ticket ${response.name} has been created | updated`,
        subAccountId: subaccountId,
      });

      toast({
        title: "Success",
        description: "Ticket has been created",
      });

      if (response) getNewTicket([response]);
      router.refresh();
    } catch (error) {
      console.error("Error creating ticket: ", error);
      toast({
        title: "Error",
        description: "Error creating ticket",
      });
    }
    setClose();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ticket Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isLoading}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              disabled={isLoading}
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Value</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Value"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <h3>Add tags</h3>
            <TagCreator 
              subAccountId={subaccountId}
              getSelectedTags={setTags}
              defaultTags={defaultData.ticket?.tags || []}
            />   
            <FormLabel>Assigned to Team member</FormLabel>
            <Select
              onValueChange={setAssignedTo}
              defaultValue={assignedTo.toString()}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage alt="contact" />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-sm text-muted-foreground">
                        Unassigned
                      </span>
                    </div>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {allTeamMembers.map((teamMember) => (
                  <SelectItem
                    key={teamMember._id.toString()}
                    value={teamMember._id.toString()}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage alt="contact" src={teamMember.avatarUrl} />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-sm text-muted-foreground">
                        {teamMember.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormLabel>Customer</FormLabel>
            <Popover>
              <PopoverTrigger asChild className="w-full">
                <Button
                  variant="outline"
                  role="combobox"
                  className="justify-between"
                >
                  {contact
                    ? contactList.find(
                        (contactItem) => contactItem._id === contact
                      )?.name
                    : 'Select customer'}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search customer..."
                    className="h-9"
                    value={search}
                    onChangeCapture={async (value) => {
                      //@ts-ignore
                      setSearch(value.target.value);
                      if (saveTimerRef.current)
                        clearTimeout(saveTimerRef.current);
                      saveTimerRef.current = setTimeout(async () => {
                        const response = await searchContacts(
                          //@ts-ignore
                          value.target.value
                        );
                        setContactList(response);
                        setSearch("");
                      }, 1000);
                    }}
                  />
                  <CommandEmpty>No customer found.</CommandEmpty>
                  <CommandGroup>
                    {contactList.map((contactItem) => (
                      <CommandItem
                        key={contactItem._id}
                        value={contactItem._id}
                        onSelect={(currentValue) => {
                          setContact(
                            currentValue === contact ? "" : currentValue
                          );
                        }}
                      >
                        {contactItem.name}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            contact === contactItem._id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <Button className="w-20 mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TicketForm;
