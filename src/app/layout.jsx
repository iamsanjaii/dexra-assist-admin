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

import { AppWrapper } from "@/components/layout/AppWrapper";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="h-screen flex overflow-hidden bg-background text-foreground">
        <AppWrapper>
          {children}
        </AppWrapper>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
