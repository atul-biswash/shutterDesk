"use client";

import { Bell, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header
      data-app-chrome="true"
      className="h-16 border-b border-border bg-surface/80 backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-30 print:hidden"
    >
      <div className="flex-1 min-w-0">
        <h1 className="font-serif text-xl text-text-primary leading-none">{title}</h1>
        {subtitle && (
          <p className="text-xs font-sans text-text-muted mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <Input
            placeholder="Search…"
            className="w-48 pl-8 h-8 text-xs bg-surface-raised"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="w-4 h-4" strokeWidth={1.75} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber" />
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="w-4 h-4" strokeWidth={1.75} />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber/20 border border-amber/30 flex items-center justify-center">
            <span className="text-[10px] font-semibold font-sans text-amber">AD</span>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold font-sans text-text-primary leading-none">Admin</p>
            <div className="mt-0.5">
              <Badge variant="default" className="text-[9px] px-1.5 py-0">Admin</Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
