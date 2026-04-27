"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  CreditCard,
  Camera,
  Wallet,
  Users,
  ChevronRight,
  Aperture,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  matchExact?: boolean;
};

type RoleConfig = {
  label: string;
  description: string;
  user: { name: string; email: string; initials: string };
  nav: NavItem[];
};

const roleConfigs: Record<"admin" | "photographer" | "office", RoleConfig> = {
  admin: {
    label: "Admin View",
    description: "Studio Manager",
    user: { name: "Admin User", email: "admin@shutterdesk.com", initials: "AD" },
    nav: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, matchExact: true },
      { label: "Events", href: "/admin/events", icon: Calendar },
      { label: "Invoices", href: "/admin/invoices", icon: FileText },
      { label: "Finances", href: "/admin/finances", icon: Wallet },
      { label: "Photographers", href: "/admin/photographers", icon: Camera },
    ],
  },
  photographer: {
    label: "Photographer View",
    description: "My Workspace",
    user: { name: "James Okafor", email: "james@shutterdesk.com", initials: "JO" },
    nav: [
      { label: "Dashboard", href: "/photographer", icon: LayoutDashboard, matchExact: true },
      { label: "My Schedule", href: "/photographer/schedule", icon: Calendar },
      { label: "Earnings", href: "/photographer/earnings", icon: Wallet },
    ],
  },
  office: {
    label: "Office View",
    description: "Office Staff",
    user: { name: "Office Staff", email: "office@shutterdesk.com", initials: "OS" },
    nav: [
      { label: "Dashboard", href: "/office", icon: LayoutDashboard, matchExact: true },
      { label: "Bookings", href: "/office/bookings", icon: Calendar },
      { label: "Clients", href: "/office/clients", icon: Users },
      { label: "Invoices", href: "/office/invoices", icon: FileText },
    ],
  },
};

const portalLinks = [
  { label: "Admin Portal", href: "/admin", role: "admin", scope: "/admin" },
  { label: "Office Portal", href: "/office", role: "office", scope: "/office" },
  { label: "Photographer Portal", href: "/photographer", role: "photographer", scope: "/photographer" },
];

function detectRole(pathname: string): keyof typeof roleConfigs {
  if (pathname.startsWith("/photographer")) return "photographer";
  if (pathname.startsWith("/office")) return "office";
  return "admin";
}

export function Sidebar() {
  const pathname = usePathname();
  const currentRole = detectRole(pathname);
  const config = roleConfigs[currentRole];

  const isNavActive = (item: NavItem) => {
    if (item.matchExact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-surface border-r border-border flex flex-col z-40 print:hidden">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-amber/10 border border-amber/30">
          <Aperture className="w-4 h-4 text-amber" strokeWidth={1.5} />
        </div>
        <div>
          <span className="font-serif text-lg text-text-primary leading-none block">
            ShutterDesk
          </span>
          <span className="text-[10px] text-text-muted font-sans uppercase tracking-widest">
            {config.description}
          </span>
        </div>
      </div>

      <div className="px-5 pb-3">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-amber-subtle border border-amber/20">
          <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
          <span className="text-[10px] font-sans font-semibold text-amber uppercase tracking-wider">
            {config.label}
          </span>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-sans text-text-muted uppercase tracking-widest px-3 pb-2 pt-1">
          Navigation
        </p>
        {config.nav.map((item) => {
          const Icon = item.icon;
          const isActive = isNavActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-sans font-medium transition-all duration-150 group",
                isActive
                  ? "bg-amber/10 text-amber border border-amber/20 shadow-amber-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-amber" : "text-text-muted group-hover:text-text-secondary"
                )}
                strokeWidth={1.75}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-3 h-3 text-amber/60" strokeWidth={2} />
              )}
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="px-3 py-4 space-y-0.5">
        <div className="flex items-center justify-between px-3 pb-2">
          <p className="text-[10px] font-sans text-text-muted uppercase tracking-widest">
            Switch Role
          </p>
          <ArrowLeftRight className="w-3 h-3 text-text-muted" strokeWidth={2} />
        </div>
        {portalLinks.map((link) => {
          const isActive = currentRole === link.role;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-sans transition-all duration-150",
                isActive
                  ? "text-amber bg-amber-subtle/50"
                  : "text-text-muted hover:text-text-secondary hover:bg-surface-hover"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  isActive ? "bg-amber" : "bg-surface-hover"
                )}
              />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="px-5 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-amber/20 border border-amber/30 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold font-sans text-amber">
              {config.user.initials}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium font-sans text-text-primary truncate">
              {config.user.name}
            </p>
            <p className="text-[10px] font-sans text-text-muted truncate">
              {config.user.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
