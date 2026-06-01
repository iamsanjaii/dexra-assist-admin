"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const getPageTitle = (pathname) => {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/knowledge-base")) return "Knowledge Base";
  if (pathname.startsWith("/qa-management")) return "Q&A Management";
  if (pathname.startsWith("/chatbot")) return "Chatbot Playground";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Overview";
};

export function TopNavigation() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">{pageTitle}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-muted/50 pl-9"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-8 w-8 rounded-full focus:outline-none">
            <Avatar className="h-8 w-8 hover:opacity-80 transition-opacity">
              <AvatarImage src={user?.picture} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || "Admin User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "admin@dexra.ai"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
