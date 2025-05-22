import { Stethoscope } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LogoProps extends HTMLAttributes<HTMLDivElement> {}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <Stethoscope className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
      <span className="text-xl sm:text-2xl font-bold text-primary tracking-tight">Diagnosify</span>
    </div>
  );
}
