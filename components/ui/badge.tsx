import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors', {
  variants: {
    variant: {
      default: 'bg-[#5a8a6b]/10 text-[#5a8a6b]',
      secondary: 'bg-[#c47a5a]/10 text-[#c47a5a]',
      accent: 'bg-[#c4959e]/10 text-[#c4959e]',
      destructive: 'bg-red-100 text-red-700',
      outline: 'border border-[#e2d9d0] text-[#718096]',
    },
  },
  defaultVariants: { variant: 'default' },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}
function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
export { Badge, badgeVariants }
