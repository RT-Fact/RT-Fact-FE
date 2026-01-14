import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-sm transition-colors",
  {
    variants: {
      variant: {
        default: "",
        claim: "p-4",
        opinion: "p-4",
        summary: "p-4",
        "verdict-applied": "p-4 border-blue-500 border-2 bg-green-50",
        "verdict-ignored": "p-4 border-gray-300 border-2 bg-gray-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface CardProps extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const CardRoot = ({ className, variant, asChild = false, ref, ...props }: CardProps) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />;
};

const CardHeader = ({ className, ref, ...props }: React.ComponentProps<"div">) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

const CardTitle = ({ className, ref, ...props }: React.ComponentProps<"h3">) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
);

const CardDescription = ({ className, ref, ...props }: React.ComponentProps<"p">) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
);

const CardContent = ({ className, ref, ...props }: React.ComponentProps<"div">) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
);

const CardFooter = ({ className, ref, ...props }: React.ComponentProps<"div">) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
);

// Compound Component Pattern: 서브 컴포넌트를 Card 객체에 할당
const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

export { Card, cardVariants };
