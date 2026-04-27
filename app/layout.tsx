import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Shell } from "@/components/layout/Shell";

export const metadata: Metadata = {
  title: "ShutterDesk — Studio Management",
  description: "Photography studio management platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <Shell>{children}</Shell>
        </SessionProvider>
      </body>
    </html>
  );
}
