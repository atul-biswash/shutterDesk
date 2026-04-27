"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname.startsWith("/auth");

  if (isAuth) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-60 print:ml-0 min-h-screen flex flex-col">
        {children}
      </main>
    </div>
  );
}
