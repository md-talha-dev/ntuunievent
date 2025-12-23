import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5",
        destructive: "bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground hover:shadow-lg hover:-translate-y-0.5",
        outline: "border-2 border-primary/30 bg-gradient-to-br from-background to-muted/50 hover:border-primary/60 hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 hover:-translate-y-0.5",
        secondary: "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground hover:shadow-md hover:-translate-y-0.5",
        ghost: "hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/15 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-gradient-to-r from-success to-success/70 text-success-foreground hover:shadow-lg hover:-translate-y-0.5",
        accent: "bg-gradient-accent text-accent-foreground hover:shadow-lg hover:-translate-y-0.5 font-semibold",
        hero: "bg-gradient-primary text-primary-foreground hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 font-semibold",
        interested: "border-2 border-info/50 bg-gradient-to-br from-info/5 to-info/15 text-info hover:bg-gradient-to-br hover:from-info hover:to-info/80 hover:text-info-foreground hover:-translate-y-0.5",
        going: "border-2 border-success/50 bg-gradient-to-br from-success/5 to-success/15 text-success hover:bg-gradient-to-br hover:from-success hover:to-success/80 hover:text-success-foreground hover:-translate-y-0.5",
        "interested-active": "border-2 border-info bg-gradient-to-br from-info to-info/80 text-info-foreground shadow-md",
        "going-active": "border-2 border-success bg-gradient-to-br from-success to-success/80 text-success-foreground shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
