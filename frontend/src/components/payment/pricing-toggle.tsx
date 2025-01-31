"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function PricingToggle({ isAnnual }: { isAnnual: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
const togglePlan = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("plan", isAnnual ? "monthly" : "annual")
    router.replace(`/pricing?${params.toString()}`, { scroll: false }) // Prevent scroll reset
}

  return (
    <div className="flex items-center justify-center mt-8 space-x-4">
      <span className="text-lg font-medium text-foreground">Monthly</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={isAnnual} 
          onChange={togglePlan} 
        />
        <div className="w-14 h-7 bg-muted rounded-full peer-focus:outline-none peer relative transition-colors peer-checked:bg-primary">
          <div className={`absolute top-0.5 left-[4px] w-6 h-6 bg-white border border-gray-300 rounded-full transition-transform ${isAnnual ? "translate-x-7" : "translate-x-0"}`}></div>
        </div>
      </label>
      <span className="text-lg font-medium text-foreground">
        Annual <span className="text-green-500 text-sm">(Save 20%)</span>
      </span>
    </div>
  )
}
