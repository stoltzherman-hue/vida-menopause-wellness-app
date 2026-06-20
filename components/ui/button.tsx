import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#5a8a6b] text-white hover:bg-[#4a7a5b] focus-visible:ring-[#5a8a6b]',
        secondary: 'bg-[#c47a5a] text-white hover:bg-[#b46a4a]',
        outline: 'border border-[#e2d9d0] bg-white hover:bg-[#f0ece4] text-[#2d3748]',
        ghost: 'hover:bg-[#f0ece4] text-[#2d3748]',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        link: 'text-[#5a8a6b] underline-offset-4 hover:underline p-0 h-auto min-h-0',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-8 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'
export { Button, buttonVariants }
