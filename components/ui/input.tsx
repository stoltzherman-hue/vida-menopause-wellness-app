import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-2xl border-2 border-[#ede0d8] bg-white/80 px-5 py-2 text-base text-[#3d2c35] placeholder:text-[#b8a9a0] focus:outline-none focus:ring-0 focus:border-[#6b9e80] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
