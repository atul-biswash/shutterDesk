import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "ShutterDesk — Studio Management",
  description: "Photography studio management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <main className="flex-1 ml-60 print:ml-0 min-h-screen flex flex-col">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
