"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  MessageSquareText,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Knowledge Base", href: "/knowledge-base", icon: Database },
  { name: "Q&A Management", href: "/qa-management", icon: MessageSquareText },
  { name: "Chatbot Playground", href: "/chatbot", icon: Bot },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b px-6 gap-2">
        <img src="/dexra-assist.png" alt="Dexra Assist" className="h-8 w-8 object-contain" />
        <span className="text-xl font-bold tracking-tight text-primary">Dexra Assist</span>
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.picture} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{user?.name || "Admin User"}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.email || "admin@dexra.ai"}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
          Log out
        </button>
      </div>
    </div>
  );
}
