import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

/**
 * Only ONE gold button per view. Gold is the brand's signature, not a
 * surface colour — past roughly 6% of visible area it reads as gaudy
 * rather than valuable. Secondary actions take tile green or the hairline.
 */
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold-leaf text-navy-950 border border-accent-600 shadow-gold-relief hover:-translate-y-px hover:shadow-gold-glow focus-visible:ring-accent-300",
  accent: "bg-primary-600 text-white hover:bg-primary-700 hover:-translate-y-px focus-visible:ring-primary-300",
  outline:
    "border border-neutral-300 bg-white text-neutral-800 hover:border-accent-500 hover:bg-accent-50 focus-visible:ring-accent-200",
  ghost: "bg-transparent text-accent-700 hover:bg-accent-50 focus-visible:ring-accent-200",
  danger: "bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-300",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium",
          "transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out",
          "active:translate-y-px",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "disabled:hover:translate-y-0 disabled:hover:shadow-none",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
