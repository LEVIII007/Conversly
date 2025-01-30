'use client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

import { useState, useEffect } from "react";
import { pricingPlans } from "@/lib/pricing-constants";
import PaymentCard from "@/components/payment/payment-card";
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import HeroSection from "@/components/payment/payment-hero";
import Header from "@/components/Header";
import UpperHeader from "@/components/upperHeader";
import FeatureComparison from "@/components/payment/comparion";
import TrustSignals from "@/components/payment/trust-signals";
import { Mail, MessageCircle } from 'lucide-react';
import Footer from "@/components/payment/footer";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => console.log("Razorpay script loaded successfully");
      script.onerror = () => console.error("Failed to load Razorpay script");
    }
  }, []);

  return (
    <div>
    <section id="pricingPlans" className="py-20 bg-white dark:bg-gray-900">
      <UpperHeader />
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16 animate__animated animate__fadeIn">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Plan</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">Select the perfect plan for your business needs</p>

        <div className="flex items-center justify-center mt-8 space-x-4">
        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Monthly</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
          type="checkbox"
          className="sr-only peer"
          checked={isAnnual}
          onChange={() => setIsAnnual(!isAnnual)}
          />
          <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white dark:after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Annual <span className="text-green-500 text-sm">(Save 20%)</span>
        </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => (
        <div
          key={plan.id}
          className={`border rounded-2xl p-8 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 ${
          plan.popular ? "border-2 border-blue-500 transform scale-105" : ""
          } ${
          plan.id === "4"
            ? "animate__animated animate__fadeInLeft"
            : plan.id === "5"
            ? "animate__animated animate__fadeInUp"
            : "animate__animated animate__fadeInRight"
          }`}
        >
          {plan.popular && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
            Most Popular
          </div>
          )}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{plan.description}</p>
          <div className="mt-6">
          <div className={isAnnual ? "hidden" : ""}>
            <span className="text-4xl font-bold">${plan.priceMonthly.toFixed(2)}</span>
            <span className="text-gray-600 dark:text-gray-300">/month</span>
          </div>
          <div className={isAnnual ? "" : "hidden"}>
            <span className="text-4xl font-bold">${(plan.priceAnnually / 12).toFixed(2)}</span>
            <span className="text-gray-600 dark:text-gray-300">/month</span>
          </div>
          </div>
          <ul className="mt-8 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-900 dark:text-gray-300">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {feature}
            </li>
          ))}
          </ul>
          <PaymentCard
          planId={plan.id}
          paymentAmount={isAnnual ? plan.priceAnnually : plan.priceMonthly}
          planDetails={{
            name: plan.name,
            isAnnual: isAnnual,
          }}
          />
        </div>
        ))}
      </div>
      </div>
      <FeatureComparison />
      <TrustSignals />
    </section>
          <Footer />
          </div>
  );
}
