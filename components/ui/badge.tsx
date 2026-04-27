import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium font-sans transition-colors",
  {
    variants: {
      variant: {
        default: "bg-amber-subtle text-amber border border-amber/30",
        secondary: "bg-surface-raised text-text-secondary border border-border",
        success: "bg-green-profit-subtle text-green-profit border border-green-profit/30",
        destructive: "bg-red-expense-subtle text-red-expense border border-red-expense/30",
        outline: "border border-border text-text-secondary",
        pending: "bg-amber-subtle/50 text-amber/80 border border-amber/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
