import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const switchStyles = cva(
  "inline-flex items-center rounded-none border-2 border-black transition-all focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-gray-200",
        brutal: "bg-white shadow-[4px_4px_0px_0px_#000]",
      },
      size: {
        default: "h-6 w-11",
        sm: "h-5 w-9",
      },
    },
    defaultVariants: {
      variant: "brutal", // Default to brutalist style
      size: "default",
    },
  }
);

const thumbStyles = cva(
  "block rounded-none border-2 border-black bg-white transition-transform",
  {
    variants: {
      variant: {
        default: "",
        brutal: "shadow-[2px_2px_0px_0px_#000]",
      },
      size: {
        default: "h-5 w-5",
        sm: "h-4 w-4",
      },
    },
    defaultVariants: {
      variant: "brutal",
      size: "default",
    },
  }
);

export interface SwitchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof switchStyles> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { className, variant, size, checked = false, onCheckedChange, ...props },
    ref
  ) => {
    const handleClick = () => {
      onCheckedChange?.(!checked);
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={switchStyles({ variant, size, className })}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        <span
          className={thumbStyles({
            variant,
            size,
            className: `transform ${
              checked ? "translate-x-5" : "translate-x-0"
            } ${checked ? "bg-lime-400" : "bg-white"}`,
          })}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
