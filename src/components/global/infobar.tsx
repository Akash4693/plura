"use client"

import React, { useState } from "react"
import { UserButton } from "@clerk/nextjs"
import { twMerge } from "tailwind-merge"
import { Role } from "@/constants/enums/role.enum"
import { NotificationWithUser } from "@/lib/types/notification.types"
import { ModeToggle } from "@/components/global/mode-toggle"
import { 
    Sheet, 
    SheetContent, 
    SheetDescription, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger 
} from "@/components/ui/sheet"
import { Bell } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Props = {
    notifications: NotificationWithUser[] | []
    role?: Role
    className?: string
    subAccountId?: string
}


const InfoBar = ({ 
    notifications, 
    role, 
    className, 
    subAccountId 
}: Props) => {
    const [allNotifications, setAllNotifications] = useState<NotificationWithUser[]>(notifications)
    const [showAll, setShowAll] = useState(true)  

        console.log("Info bar notifications", notifications)

    const handleClick = () => {
        if (!showAll) {
             setAllNotifications(
      notifications.filter(
        (item) => item.subAccountId?.toString() === subAccountId
      ) ?? []
    );
  } else {
    // 🔍 Toggle was ON → Now turning OFF → Show all
    setAllNotifications(notifications);
  }
        setShowAll((prev) => !prev)
    }

    return (
        <div
        className={twMerge(
            "fixed z-[20] md:left-[300px] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex gap-4 items-center border-b-[1px]",
            className
        )}
        >
            <div className="flex items-center gap-2 ml-auto">
                <UserButton afterSignOutUrl="/" />
                <Sheet>
                  <SheetTrigger>
                    <div className="rounded-full w-9 h-9 bg-primary flex items-center justify-center text-white">
                        <Bell size={17} />
                    </div>
                  </SheetTrigger>
                  <SheetContent className="mt-4 mr-4 pr-4 overflow-scroll" >
                    <SheetHeader className="text-left">
                        <SheetTitle>Notifications</SheetTitle>
                        <SheetDescription>
                            {(role === Role.AGENCY_ADMIN || role === Role.AGENCY_OWNER) && (
                                <Card className="flex items-center justify-between p-4">
                                    Current Sub account
                                    <Switch onCheckedChange={handleClick} />
                                </Card>
                            )}
                        </SheetDescription>
                    </SheetHeader>
                    {allNotifications?.map((notification) => {
                        return (
                        <div
                            key={notification._id}
                            className="flex flex-col gap-y-2 my-5 mb-2 text-ellipsis"
                        >
                            <div className="flex gap-2">
                                <Avatar>
                                    <AvatarImage
                                        src={notification.user?.avatarUrl}
                                        alt="Profile Picture"
                                    />
                                    <AvatarFallback className="bg-primary">
                                        {typeof notification.user?.name === "string" ? notification?.User?.name?.toString().slice(0, 2).toUpperCase() : ""}
                                    </AvatarFallback>    
                                </Avatar>
                                <div className="flex flex-col">
                                  <p>
                                    <span className="font-bold">
                                        {notification?.notification.split("|")[0]}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {notification?.notification.split("|")[1]}
                                    </span>
                                    <span className="font-bold">
                                        {notification?.notification.split("|")[2]}
                                    </span>
                                  </p>
                                  <small className="text-xs text-muted-foreground">
                                    {new Date(notification?.createdAt).toLocaleDateString()}
                                  </small>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                    {allNotifications?.length === 0 && (
                        <div className="flex items-center justify-center text-muted-foreground mb-4">
                            no notifications
                        </div>
                    )}
                  </SheetContent>
                </Sheet>
                <ModeToggle />
            </div>
        </div>
    )
}

export default InfoBar