"use client";

import { Contact } from '@/lib/types/contact.types';
import { Tag } from '@/lib/types/tag.types';
import { TicketWithTags } from '@/lib/types/ticket.types';
import { useModal } from '@/providers/modal-provider';
import React, { useState } from 'react'

type Props = {
    laneId: string
    subAccountId: string
    getNewTicket: (ticket: TicketWithTags[0]) => void
}

const TicketForm = ({ laneId, subAccountId, getNewTicket }: Props) => {
    const { data: defaultData } = useModal()
    const [tags, setTags] = useState<Tag[]>([])
    const [contact, setContact] = useState("")
    const [search, setSearch] = useState("")
    const [contactList, setContactList] = useState<Contact[]>([])
    const [assignedTo, setAssignedTo] = useState(
        defaultData.ticket?.Asssigned?.id || 
    )
  return (
    <div>TicketForm</div>
  )
}

export default TicketForm