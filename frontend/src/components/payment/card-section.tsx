// components/payment/pricing-cards-section.tsx
"use client";

import Script from "next/script";
import { pricingPlans } from "@/lib/pricing-constants";
import PricingCard from "./pricing-card";

interface PricingCardsSectionProps {
  isAnnual: boolean;
}

export default function PricingCardsSection({ isAnnual }: PricingCardsSectionProps) {
  return (
    <>
      {/* Load Razorpay script once */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} isAnnual={isAnnual} />
        ))}
      </div>
    </>
  );
}
