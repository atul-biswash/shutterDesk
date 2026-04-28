import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { auth } from "@/auth";
import { getAllUsers } from "@/lib/data";
import { UsersTable } from "./UsersTable";

export default async function UsersPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/admin");

  const users = await getAllUsers();

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="User Management"
        subtitle="Add and manage staff and photographer accounts"
      />

      <div className="flex-1 p-6 space-y-5">
        <div className="opacity-0 animate-fade-in">
          <h2 className="font-serif text-2xl text-text-primary">
            Team Members
          </h2>
          <p className="text-sm font-sans text-text-secondary mt-0.5">
            All admin, office, and photographer accounts in the studio.
          </p>
        </div>

        <div className="opacity-0 animate-fade-in-delay-1">
          <UsersTable users={users} />
        </div>
      </div>
    </div>
  );
}
