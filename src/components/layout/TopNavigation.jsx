"use client";

import { usePathname } from "next/navigation";

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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">{pageTitle}</h1>
      </div>
    </header>
  );
}
