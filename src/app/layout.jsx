import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Dexra Assist",
  description: "A Product by Dexra",
};

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="h-screen flex overflow-hidden bg-background text-foreground">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <TopNavigation />
          <main className="flex-1 overflow-y-auto bg-muted/20">
            <div className="mx-auto w-full p-6">
              {children}
            </div>
          </main>
        </div>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
