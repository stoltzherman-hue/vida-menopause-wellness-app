import * as React from 'react'
import { cn } from '@/lib/utils'
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input type={type} className={cn('flex h-11 w-full rounded-xl border border-[#e2d9d0] bg-white px-4 py-2 text-base text-[#2d3748] placeholder:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#5a8a6b] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#222738] dark:border-[#353a4d] dark:text-[#e8e2d8]', className)} ref={ref} {...props} />
))
Input.displayName = 'Input'
export { Input }
