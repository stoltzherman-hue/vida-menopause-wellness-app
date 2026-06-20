import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-[#6b9e80] text-white hover:bg-[#5a8a6b] shadow-[0_4px_14px_rgba(107,158,128,0.35)] hover:shadow-[0_6px_20px_rgba(107,158,128,0.45)] focus-visible:ring-[#6b9e80] rounded-full',
        secondary: 'bg-[#c47a5a] text-white hover:bg-[#b46a4a] shadow-[0_4px_14px_rgba(196,122,90,0.3)] hover:shadow-[0_6px_20px_rgba(196,122,90,0.4)] focus-visible:ring-[#c47a5a] rounded-full',
        outline: 'border-2 border-[#ede0d8] bg-white/80 hover:bg-[#f5ede8] text-[#3d2c35] hover:border-[#c4959e] rounded-full backdrop-blur-sm',
        ghost: 'hover:bg-[#f5ede8] text-[#8a7a72] hover:text-[#3d2c35] rounded-full',
        soft: 'bg-[#e8f2ec] text-[#4a7a5b] hover:bg-[#d4eadb] rounded-full',
        blush: 'bg-[#faf0f2] text-[#c4959e] hover:bg-[#f5e4e8] border border-[#e8b4bc] rounded-full',
        destructive: 'bg-[#d95f5f] text-white hover:bg-[#c44f4f] rounded-full',
        link: 'text-[#6b9e80] underline-offset-4 hover:underline p-0 h-auto min-h-0 rounded-none',
      },
      size: {
        default: 'h-11 px-7 py-2 text-sm',
        sm: 'h-9 px-5 text-xs',
        lg: 'h-13 px-9 text-base',
        icon: 'h-11 w-11 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
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
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
