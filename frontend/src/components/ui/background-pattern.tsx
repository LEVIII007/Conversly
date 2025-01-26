import type React from "react"

interface BackgroundPatternProps {
  className?: string
}

export const BackgroundPattern: React.FC<BackgroundPatternProps> = ({ className = "" }) => {
  return (
    <div
      className={`absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.1)_1px,transparent_1px)] bg-[size:14px_14px] ${className}`}
      aria-hidden="true"
    />
  )
}

