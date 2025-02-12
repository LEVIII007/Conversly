"use client";

import PaymentCard from "@/components/payment/payment-card";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    priceMonthly: number | string;
    priceAnnually: number | string;
    popular?: boolean;
    features: string[];
  };
  isAnnual: boolean;
}

export default function PricingCard({ plan, isAnnual }: PricingCardProps) {
  const router = useRouter();

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
          {typeof plan.priceMonthly === "number" ? (
            <>
              <span className="text-4xl font-bold">${plan.priceMonthly.toFixed(2)}</span>
              <span className="text-gray-400">/month</span>
            </>
          ) : (
            <span className="text-4xl font-bold">{plan.priceMonthly}</span>
          )}
        </div>
        {/* Annual Price */}
        <div className={isAnnual ? "" : "hidden"}>
          {typeof plan.priceAnnually === "number" ? (
            <>
              <span className="text-4xl font-bold">${(plan.priceAnnually / 12).toFixed(2)}</span>
              <span className="text-gray-400">/month</span>
            </>
          ) : (
            <span className="text-4xl font-bold">{plan.priceAnnually}</span>
          )}
        </div>
      </div>
      <ul className="mt-8 space-y-4">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-100">
            <div className="mt-1 p-0.5 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20">
              <Check className="w-4 h-4 text-pink-500" />
            </div>
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Payment CTA */}
      
        <PaymentCard
          planId={plan.id}
          paymentAmount={isAnnual ? (typeof plan.priceAnnually === "number" ? plan.priceAnnually : plan.priceMonthly) : plan.priceMonthly}
          planDetails={{ name: plan.name, isAnnual }}
        />
    </div>
  );
}
