"use client";

import { LaneDetail } from '@/lib/types/lane.types';
import { TicketWithTags } from '@/lib/types/ticket.types';
import React, { Dispatch, SetStateAction } from 'react'

interface PipelineLaneProps {
  setAllTickets: Dispatch<SetStateAction<TicketWithTags[]>>
  allTickets: TicketWithTags
  tickets: TicketWithTags
  pipelineId: string
  laneDetails: LaneDetail
  subaccountId: string
  index: number
}

const PipelineLane: React.FC<PipelineLaneProps> = ({
  
}: Props) => {
  return (
    <div>PipeLineLane</div>
  )
}

export default PipelineLane