'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AppWrapper({ children }) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && pathname === '/login') {
        router.push('/dashboard');
      } else if (!isAuthenticated && pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const isLoginPage = pathname === '/login';

  const content = isLoginPage ? (
    <main className="h-full w-full bg-background flex items-center justify-center">
      {children}
    </main>
  ) : (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopNavigation />
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="mx-auto w-full p-6">
            {children}
          </div>
        </main>
      </div>
    </>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {content}
    </div>
  );
}
