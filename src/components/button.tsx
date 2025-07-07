"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

// 1. Define variants
const buttonVariants = cva(
  "relative font-black uppercase tracking-widest transition-all duration-200 active:translate-x-2 active:translate-y-2 active:shadow-none select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-white text-black border-4 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]",
        secondary:
          "bg-black text-white border-4 border-black shadow-[6px_6px_0px_0px_#666] hover:shadow-[10px_10px_0px_0px_#666]",
        ghost:
          "bg-transparent text-black border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:bg-black hover:text-white hover:shadow-[10px_10px_0px_0px_#000]",
        inverse:
          "bg-gray-900 text-white border-4 border-white shadow-[6px_6px_0px_0px_#fff] hover:shadow-[10px_10px_0px_0px_#fff]",
        accent:
          "bg-orange-500 text-black border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[10px_10px_0px_0px_#000] hover:bg-orange-400",
        outline:
          "bg-white text-black border-4 border-dashed border-black hover:shadow-[6px_6px_0px_0px_#000]",
      },
      size: {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// 2. Button component
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
