import { GetMediaFiles, Media } from "@/lib/types/media.types";
import React from "react";
import MediaUploadButton from "./upload-buttons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import MediaCard from "./media-card";
import { FolderSearch } from "lucide-react";

type Props = {
  data: GetMediaFiles;
  subaccountId: string;
};


const MediaComponent = ({ data, subaccountId }: Props) => {
  console.log("Media data:", data?.media)


  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Media Bucket</h1>
        <MediaUploadButton subaccountId={subaccountId} />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for file name..." />
        <CommandList className="pb-40 max-h-full">
          <CommandEmpty>No Media Files</CommandEmpty>
          <CommandGroup heading="Media Files">
          
          <div className="flex flex-wrap gap-4 pt-4">
            {data?.media.map((file) => {
              console.log("Rendering Media File:", file);
              
              return (
                <CommandItem
                  key={file._id.toString()}
                  className="p-0 max-w-[320px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                >
                  <MediaCard file={file} />
                </CommandItem>
              );
            })}
            {!data?.media.length && (
              <div className="flex items-center justify-center w-full flex-col">
                <FolderSearch 
                  size={200}
                  className="dark:text-muted text-slate-300"
                />
                <p>Empty! no files to show</p>
              </div>
            )}
          </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default MediaComponent;
