import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";
const ProfileDetail = () => {
  const [users, setusers] = useState({
    username: "",
    useremail: "",
    role: " ",
  });
  const fetchUser = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setusers(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="fixed right-4 z-50 flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Avatar className="h-10 w-10 ring-2 ring-primary ring-offset-2 transition-all duration-200 hover:ring-4">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>{""}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        {users.role}
        <DropdownMenuContent className="w-56 mt-2" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {users.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {users.useremail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileDetail;
