"use client";
import { Media } from "@/lib/types/media.types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Image from "next/image";
import { Copy, MoreHorizontal, Trash } from "lucide-react";

import { saveActivityLogsNotification } from "@/lib/actions/notification/save-activity-logs-notification.actions";

import { deleteMedia } from "@/lib/actions/media/delete-media.action";
import { useToast } from "@/hooks/use-toast";

type Props = {
  file: Media;
};

const MediaCard = ({ file }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast()

  console.log("file", file)

  const handleDeleteMedia = async () => {
    setLoading(true)
    const response = await deleteMedia(file._id)
   
    await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a media file | ${response?.name}`,
        subAccountId: response?.subAccountId.toString(),
    })

    toast({
      title: "File deleted",
      description: "The file has been deleted successfully"
    })
    
    setLoading(false)
    router.refresh()
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <article className="border w-full rounded-lg bg-slate-900">
          <div className="relative w-full h-40">
            <Image
              src={file.link}
              alt="preview image"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <p className="opacity-0 h-0 w-0">{file.name}</p>
          <div className="p-4 relative">
            <p className="text-muted-foreground">
                {file.createdAt.toDateString()}
            </p>
            <p>{file.name}</p>
            <div className="absolute top-4 right-4 p-[1px] cursor-pointer">
                <DropdownMenuTrigger>
                   <MoreHorizontal />
                </DropdownMenuTrigger>
            </div>
          </div>

          <DropdownMenuContent>
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                className="flex gap-2"
                onClick={() => {
                    navigator.clipboard.writeText(file.link)
                    toast({ title: "Copied to clipboard" })
                }}
            >
                <Copy size={15} /> Copy Image link
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem
                    className="flex gap-2"
                >
                    <Trash size={15} /> Delete file
                </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>   
        </article>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Permanently delete this file? 
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Do you want to Permanently delete this file? All sub account using this file will no longer have access to it!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive"
            onClick={handleDeleteMedia}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
};

export default MediaCard;
