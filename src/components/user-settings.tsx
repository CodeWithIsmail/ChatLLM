"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GearIcon, ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { set } from "zod";
import UsernameForm from "./username-form";
import EditUsernameForm from "./edit-username-form";
import PullModel from "./pull-model";
import useChatStore from "@/app/hooks/useChatStore";
import useAuthStore from "@/app/hooks/useAuthStore";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";

export default function UserSettings() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const userName = useChatStore((state) => state.userName);
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();

  const displayName = user?.username || userName;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex justify-start gap-3 w-full h-14 text-base font-normal items-center "
        >
          <Avatar className="flex justify-start items-center overflow-hidden">
            <AvatarImage
              src=""
              alt="User"
              width={4}
              height={4}
              className="object-contain"
            />
            <AvatarFallback>
              {displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-xs truncate">
            <p>{displayName}</p>
            {user?.email && (
              <p className="text-muted-foreground text-xs">{user.email}</p>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 p-2">
        <DropdownMenuLabel>
          {isAuthenticated ? "Account" : "Anonymous User"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <PullModel />
        </DropdownMenuItem>
        
        <Dialog>
          <DialogTrigger className="w-full">
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <div className="flex w-full gap-2 p-1 items-center cursor-pointer">
                <GearIcon className="w-4 h-4" />
                Settings
              </div>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="space-y-4">
              <DialogTitle>Settings</DialogTitle>
              <EditUsernameForm setOpen={setOpen} />
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <DropdownMenuSeparator />

        {!isAuthenticated ? (
          <DropdownMenuItem 
            onClick={() => router.push('/auth')}
            className="cursor-pointer"
          >
            <div className="flex w-full gap-2 p-1 items-center">
              <PersonIcon className="w-4 h-4" />
              Sign In
            </div>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem 
            onClick={logout}
            className="cursor-pointer text-red-600 hover:text-red-700"
          >
            <div className="flex w-full gap-2 p-1 items-center">
              <ExitIcon className="w-4 h-4" />
              Sign Out
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
