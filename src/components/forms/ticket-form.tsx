"use client";

import { useToast } from '@/hooks/use-toast';
import { searchContacts } from '@/lib/actions/contact/search-contacts-action';
import { saveActivityLogsNotification } from '@/lib/actions/notification/save-activity-logs-notification.actions';
import { getSubAccountTeamMembers } from '@/lib/actions/sub-account/get-subaccount-team-members-action';
import { upsertTicket } from '@/lib/actions/ticket/upsert-ticket-action';
import { Contact } from '@/lib/types/contact.types';
import { Tag } from '@/lib/types/tag.types';
import { TicketWithTags } from '@/lib/types/ticket.types';
import { User } from '@/lib/types/user.types';
import { useModal } from '@/providers/modal-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {
    laneId: string
    subaccountId: string
    getNewTicket: (ticket: TicketWithTags) => void
}

const currencyNumberRegex = /^\d+(\.\d{1,2})?$/;

const TicketFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  values: z.string().refine((value) => currencyNumberRegex.test(value), {
    message: "Value must be a valid price.",
  })
})

const TicketForm = ({ laneId, subaccountId, getNewTicket }: Props) => {
    const { data: defaultData, setClose } = useModal()
    const router = useRouter()
    const { toast } = useToast()
    const [tags, setTags] = useState<Tag[]>([])
    const [contact, setContact] = useState("")
    const [search, setSearch] = useState("")
    const [contactList, setContactList] = useState<Contact[]>([])
    const [allTeamMembers, setAllTeamMembers] = useState<User[]>([])
    const saveTimerRef = useRef<ReturnType<typeof setTimeout>>()
    const [assignedTo, setAssignedTo] = useState(
        defaultData.ticket?.assignedUserId?._id || "" 
    )

    const form = useForm<z.infer<typeof TicketFormSchema>>({
      mode: "onChange",
      resolver: zodResolver(TicketFormSchema),
      defaultValues: {
        name: defaultData.ticket?.name || "",
        description: defaultData.ticket?.description || "",
        values: String(defaultData.ticket?.value || 0),
      }
    })
    const isLoading = form.formState.isLoading

    useEffect(() => {
      if (subaccountId) {
        const fetchData = async () => {
          const response = await getSubAccountTeamMembers(subaccountId)
          if (response) setAllTeamMembers(response)
        }
        fetchData()
      }
    }, [subaccountId])

    useEffect(() => {
      if (defaultData.ticket) {
        form.reset({
          name: defaultData.ticket.name || "",
          description: defaultData.ticket?.description || "",
          values: String(defaultData.ticket?.value || 0),
        })
        if (defaultData.ticket.customerId)
          setContact(defaultData.ticket.customerId.toString())

        const fetchData = async () => {
          const response = await searchContacts(
            
            defaultData.ticket?.customerId?.name || "",
          )
          setContactList(response)
        }
        fetchData()
      }
    }, [defaultData])

    const onSubmit = async (values: z.infer<typeof TicketFormSchema>) => {
      if (!laneId) return
      try {
        const response = await upsertTicket(
          {
            ...values, 
            laneId,
            _id: defaultData.ticket?._id,
            assignedUserId: assignedTo,
            ...(contact ? { customerId: contact } : {}),
          },
          tags
        )

        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Ticket ${response.name} has been created | updated`,
          subAccountId: subaccountId,
        })

        toast({
          title: "Success",
          description: "Ticket has been created",
        })

        if (response) getNewTicket([response]);
          router.refresh()

      } catch (error) {
        console.error("Error creating ticket: ", error);
        toast({
          title: "Error",
          description: "Error creating ticket",
        })
      }
      setClose()
    }

  return (
    <div>TicketForm</div>
  )
}

export default TicketForm