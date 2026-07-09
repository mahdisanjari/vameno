import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm text-neutral-900",
          "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400",
          "disabled:cursor-not-allowed disabled:bg-neutral-100",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";
