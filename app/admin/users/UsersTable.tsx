"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Shield,
  Briefcase,
  Camera,
  ArrowUpRight,
  X,
  Mail,
} from "lucide-react";
import { Role } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateUserDialog } from "./CreateUserDialog";
import { getInitials, formatDate } from "@/lib/constants";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  assignedEventCount: number;
};

const roleConfig: Record<
  Role,
  {
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    badgeClass: string;
    iconBg: string;
    iconColor: string;
  }
> = {
  ADMIN: {
    label: "Admin",
    icon: Shield,
    badgeClass: "bg-amber-subtle text-amber border-amber/30",
    iconBg: "bg-amber/10 border-amber/30",
    iconColor: "text-amber",
  },
  OFFICE: {
    label: "Office",
    icon: Briefcase,
    badgeClass: "bg-surface-raised text-text-secondary border-border",
    iconBg: "bg-surface-raised border-border",
    iconColor: "text-text-secondary",
  },
  PHOTOGRAPHER: {
    label: "Photographer",
    icon: Camera,
    badgeClass: "bg-green-profit-subtle text-green-profit border-green-profit/30",
    iconBg: "bg-green-profit-subtle border-green-profit/30",
    iconColor: "text-green-profit",
  },
};

export function UsersTable({ users }: { users: UserRow[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        searchQuery === "" ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === "ADMIN").length,
      office: users.filter((u) => u.role === "OFFICE").length,
      photographers: users.filter((u) => u.role === "PHOTOGRAPHER").length,
    };
  }, [users]);

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
  };

  const hasActiveFilters = searchQuery !== "" || roleFilter !== "all";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-[10px] font-sans uppercase tracking-widest text-text-muted">
              Total Users
            </p>
            <p className="font-serif text-2xl text-text-primary mt-1 leading-none">
              {stats.total}
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber/20 bg-amber-subtle/40">
          <CardContent className="p-4">
            <p className="text-[10px] font-sans uppercase tracking-widest text-amber/70">
              Admins
            </p>
            <p className="font-serif text-2xl text-amber mt-1 leading-none">
              {stats.admins}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-[10px] font-sans uppercase tracking-widest text-text-muted">
              Office
            </p>
            <p className="font-serif text-2xl text-text-secondary mt-1 leading-none">
              {stats.office}
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-profit/20 bg-green-profit-subtle">
          <CardContent className="p-4">
            <p className="text-[10px] font-sans uppercase tracking-widest text-green-profit/70">
              Photographers
            </p>
            <p className="font-serif text-2xl text-green-profit mt-1 leading-none">
              {stats.photographers}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardContent className="p-4 border-b border-border-subtle">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <Input
                placeholder="Search by name or email…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={roleFilter}
                onValueChange={(v) => setRoleFilter(v as typeof roleFilter)}
              >
                <SelectTrigger className="w-[160px] h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="OFFICE">Office</SelectItem>
                  <SelectItem value="PHOTOGRAPHER">Photographer</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-text-muted hover:text-amber"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </Button>
              )}

              <CreateUserDialog />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3 text-xs font-sans text-text-muted">
              <span>Showing</span>
              <span className="text-amber font-semibold">
                {filteredUsers.length}
              </span>
              <span>of</span>
              <span className="text-text-secondary font-medium">
                {users.length}
              </span>
              <span>users</span>
            </div>
          )}
        </CardContent>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Events</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-10 pr-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <p className="text-sm font-sans text-text-secondary">
                      {users.length === 0
                        ? "No users yet."
                        : "No users match your filters."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const cfg = roleConfig[user.role];
                  const RoleIcon = cfg.icon;
                  return (
                    <TableRow key={user.id} className="group">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 ${cfg.iconBg}`}
                          >
                            <span
                              className={`text-[10px] font-semibold font-sans ${cfg.iconColor}`}
                            >
                              {getInitials(user.name)}
                            </span>
                          </div>
                          <span className="font-medium whitespace-nowrap">
                            {user.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-text-secondary">
                          <Mail
                            className="w-3 h-3 text-text-muted shrink-0"
                            strokeWidth={1.75}
                          />
                          <span className="whitespace-nowrap">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`gap-1.5 ${cfg.badgeClass}`}
                          variant="default"
                        >
                          <RoleIcon className="w-2.5 h-2.5" strokeWidth={2} />
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-sans text-text-secondary">
                          {user.assignedEventCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-text-muted whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="pr-4">
                        <button className="w-7 h-7 rounded-md text-text-muted hover:text-amber hover:bg-amber-subtle transition-all opacity-50 group-hover:opacity-100 flex items-center justify-center">
                          <ArrowUpRight
                            className="w-3.5 h-3.5"
                            strokeWidth={2}
                          />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
