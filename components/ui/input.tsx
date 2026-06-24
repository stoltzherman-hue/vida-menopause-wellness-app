import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-2xl border-2 border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.05)] px-5 py-2 text-base text-[rgba(255,255,255,0.82)] placeholder:text-[rgba(255,255,255,0.32)] focus:outline-none focus:ring-0 focus:border-[#9b7cc8] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm',
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
