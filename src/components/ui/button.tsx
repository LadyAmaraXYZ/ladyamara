import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-display font-semibold tracking-wide transition-colors disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mom",
  {
    variants: {
      variant: {
        mom: "bg-mom text-night hover:bg-mom-deep",
        ghost: "border border-line bg-transparent text-ink hover:bg-grove",
        mute: "text-mute hover:text-ink",
        pad: "size-14 rounded-full border border-line bg-grove text-mom hover:bg-mom hover:text-night",
      },
      size: {
        default: "h-11 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        sm: "h-9 px-3 text-xs",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "mom", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
