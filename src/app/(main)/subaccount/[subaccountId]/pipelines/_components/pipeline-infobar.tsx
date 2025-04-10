"use client";

import CreatePipelineForm from "@/components/forms/create-pipeline-form";
import CustomModal from "@/components/global/custom-model";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Pipeline } from "@/lib/types/pipeline.types";
import { cn } from "@/lib/utils/classNames";
import { useModal } from "@/providers/modal-provider";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  subAccountId: string;
  pipelines: Pipeline[];
  pipelineId: string;
};

const PipelineInfoBar = ({ subAccountId, pipelines, pipelineId }: Props) => {
  const { setOpen: setOpenModal, setClose } = useModal()
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(pipelineId)

    const handleClickCreatePipeline = () => {
        setOpenModal(
            <CustomModal
                title="Create Pipeline"
                subheading="Pipelines allow to group tickets into lanes and track your business process all in one place."
            >
                <CreatePipelineForm subAccountId={subAccountId} /> 
            </CustomModal>
        )
    }


    return (
        <div>
            <div className="flex items-end gap-2">
                <Popover
                    open={open}
                    onOpenChange={setOpen}
                >
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            {value 
                            ? pipelines.find((pipeline) => pipeline._id === value)?.name 
                            : 'Select a pipeline...'}
                            <ChevronsUpDown className="mt-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandEmpty>No pipelines found.</CommandEmpty>
                            <CommandGroup>
                                {pipelines.map(pipeline => (
                                    <Link
                                        key={pipeline._id}
                                        href={`/subaccount/${subAccountId}/pipelines/${pipeline._id}`}
                                    >
                                        <CommandItem
                                            key={pipeline._id}
                                            value={pipeline._id}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue)
                                                setOpen(false)
                                                setClose()
                                            }}
                                        >
                                            <Check 
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === pipeline._id ? "opacity-100" : "opacity-0"	
                                                )}
                                            />
                                            {pipeline.name}
                                        </CommandItem>
                                    </Link>
                                ))}
                                <Button
                                    variant="secondary"
                                    className="flex gap-2 w-full mt-4"
                                    onClick={handleClickCreatePipeline}
                                >
                                    <Plus size={15} />
                                    Create Pipeline
                                </Button>
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

export default PipelineInfoBar;
