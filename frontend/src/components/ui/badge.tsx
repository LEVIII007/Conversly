import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'success';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variant === 'success' && "bg-green-100 text-green-800",
      variant === 'secondary' && "bg-gray-100 text-gray-800",
      variant === 'default' && "bg-indigo-100 text-indigo-800"
    )}>
      {children}
    </span>
  );
} 