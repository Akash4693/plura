"use client";

import { Tag } from "@/lib/types/tag.types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import TagComponent from "./tag";
import { PlusCircleIcon, TrashIcon, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import mongoose from "mongoose";
import { saveActivityLogsNotification } from "@/lib/actions/notification/save-activity-logs-notification.actions";
import { CommandGroup } from "cmdk";
import { getTagsForSubAccount } from "@/lib/actions/tag/get-tags-for-subaccount-action";

type Props = {
  subAccountId: string;
  getSelectedTags: (tags: Tag[]) => void;
  defaultTags?: Tag[];
};



const TagColors = ["BLUE", "GREEN", "ROSE", "PURPLE", "ORANGE"] as const;
export type TagColor = (typeof TagColors)[number];

const TagCreator = ({ getSelectedTags, subAccountId, defaultTags }: Props) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(defaultTags || []);
  const [tags, setTags] = useState<Tag[]>([]);
  const router = useRouter();
  const [value, setValue] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    getSelectedTags(selectedTags);
  }, [selectedTags]);

  useEffect(() => {
    if (subAccountId) {
      const fetchData = async () => {
        const response = await getTagsForSubAccount(subAccountId)
        if (response) setTags(response)
        console.log("Fetched tags for subAccountId:", response);
      }
      fetchData()
    }
  }, [subAccountId])

  const handleDeleteSelection = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag._id !== tagId));
  };



  const handleAddTag = async () => {
    if (!value) {
      toast({
        title: "Please enter a tag name",
        variant: "destructive",
      });
      return;
    }
    if (!selectedColor) {
      toast({
        title: "Please select a tag color",
        variant: "destructive",
      });
      return;
    }
    const tagData = {
      color: selectedColor,
      name: value,
      subAccountId: subAccountId,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Tag;

    //  setTags([...tags, tagData]);

    try {
      console.log("tagData: ", tagData);
      const response = await fetch("/api/tags/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tagData),
      });
      if (!response.ok) {
        throw new Error("Failed to create tag");
      }

      const createdTag = await response.json();

      setTags((prev) => [...prev, createdTag]);
      setSelectedTags((prev) => [...prev, createdTag]);

      setValue("");
      setSelectedColor("");
      //const response = await upsertTag(subAccountId, tagData)
      toast({
        title: "Tag created successfully",
        variant: "success",
      });




      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated tag |  ${createdTag.name}`,
        subAccountId: subAccountId,
      });
    } catch (error) {
      console.log("Failed to create tag: ", error)
      toast({
        title: "Failed to create tag",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };


  const handleAddSelections = (tag: Tag) => {
    if (selectedTags.every((tagItem) => tagItem._id !== tag._id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    setTags(tags.filter((tag) => tag._id !== tagId))
    try {
      console.log("Deleting tag with ID:", tagId,);
      const response = await fetch(`/api/tags/${tagId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete tag");
      }

      const result = await response.json();
      toast({
        title: "Tag deleted successfully",
        variant: "success",
      })




      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted tag |  ${result.data.name}`,
        subAccountId: subAccountId,
      })

      router.refresh();
    } catch (error) {
      toast({
        title: "Failed to delete tag",
        variant: "destructive",
      })
    }
  }



  return (

      <Command className="bg-transparent">
        {!!selectedTags.length && (
          <div className="flex flex-wrap gap-2 p-2 bg-background border-2 border-border rounded-md">
            {selectedTags.map((tag) => (
              <div key={tag._id?.toString()} className="flex items-center">
                <TagComponent title={tag.name} colorName={tag.color} />
                <X
                  size={14}
                  className="text-muted-foreground cursor-pointer"
                  onClick={() => handleDeleteSelection(tag._id?.toString() || "")}
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 my-2">
          {TagColors.map((colorName) => (
            <TagComponent
              key={colorName}
              selectedColor={setSelectedColor}
              title=""
              colorName={colorName}
            />
          ))}
        </div>
        <div className="relative">
          <CommandInput
            placeholder="Search Tag..."
            value={value}
            onValueChange={setValue}
          />
          <PlusCircleIcon
            onClick={handleAddTag}
            size={20}
            className="absolute top-1/2 transform -translate-y-1/2 right-2 hover:text-primary transition-all cursor-pointer text-muted-foreground"
          />
        </div>
        <CommandList>
          <CommandSeparator />

          <CommandGroup heading="Tags">
            {tags.map((tag) => (
              <CommandItem
                key={tag._id?.toString()}
                className="hover:!bg-secondary !bg-transparent flex items-center justify-between !font-light cursor-pointer"
              >
                <div onClick={() => handleAddSelections(tag)}>
                  <TagComponent title={tag.name} colorName={tag.color} />
                </div>

              <AlertDialog>
                <AlertDialogTrigger>
                  <TrashIcon
                    size={16}
                    className="cursor-pointer text-muted-foreground hover:text-rose-400 transition-all"
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-left">
                      Delete this tag?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                      Permanently delete this tag.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={() => handleDeleteTag(tag._id.toString())}
                    >
                      Delete Tag
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </Command>
    
  );
};

export default TagCreator;
