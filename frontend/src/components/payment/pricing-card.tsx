// components/payment/pricing-card.tsx
"use client";

import PaymentCard from "@/components/payment/payment-card";

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    priceMonthly: number;
    priceAnnually: number;
    popular?: boolean;
    features: string[];
  };
  isAnnual: boolean;
}

export default function PricingCard({ plan, isAnnual }: PricingCardProps) {
  return (
    <div
      className={`
        relative border rounded-2xl p-8 bg-gray-900/60 
        shadow-lg hover:shadow-xl transition-shadow duration-300
        backdrop-blur-sm text-white
        ${plan.popular ? "border-2 border-purple-500 transform scale-105" : "border-gray-800"}
        ${
          plan.id === "4"
            ? "animate__animated animate__fadeInLeft"
            : plan.id === "5"
            ? "animate__animated animate__fadeInUp"
            : "animate__animated animate__fadeInRight"
        }
      `}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold font-heading">{plan.name}</h3>
      <p className="text-gray-400 mt-2">{plan.description}</p>
      <div className="mt-6">
        {/* Monthly Price */}
        <div className={isAnnual ? "hidden" : ""}>
          <span className="text-4xl font-bold">${plan.priceMonthly.toFixed(2)}</span>
          <span className="text-gray-400">/month</span>
        </div>
        {/* Annual Price */}
        <div className={isAnnual ? "" : "hidden"}>
          <span className="text-4xl font-bold">${(plan.priceAnnually / 12).toFixed(2)}</span>
          <span className="text-gray-400">/month</span>
        </div>
      </div>
      <ul className="mt-8 space-y-4">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-100">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* Payment CTA */}
      <PaymentCard
        planId={plan.id}
        paymentAmount={isAnnual ? plan.priceAnnually : plan.priceMonthly}
        planDetails={{ name: plan.name, isAnnual }}
      />
    </div>
  );
}
