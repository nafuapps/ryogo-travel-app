"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 lg:gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-slate-950 dark:bg-white shadow-sm hover:opacity-80",
        destructive: "bg-red-700 dark:bg-red-300 hover:opacity-80 shadow-xs",
        outline:
          "border border-slate-300 shadow-xs hover:opacity-80 dark:border-slate-700",
        // secondary:
        //   "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/70",
        ghost: "hover:bg-slate-200/80 dark:hover:bg-slate-700/80",
        // link: "text-primary underline-offset-4 hover:underline",
        brand: "bg-sky-700 dark:bg-sky-300 hover:opacity-80 shadow-sm",
        white: "bg-white dark:bg-slate-950 shadow-sm hover:opacity-80",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-2 has-[>svg]:lg:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 lg:h-11 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 lg:size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
