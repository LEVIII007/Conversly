'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { pricingPlans } from '@/lib/pricing-constants';
import PaymentCard from '@/components/payment/payment-card';
import Script from 'next/script';
import UpperHeader from '@/components/upperHeader';
import { Mail, MessageCircle } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

    // Ensure Razorpay script is loaded
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
        <UpperHeader />
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground">
          Choose the perfect plan for your chatbot needs
        </p>
      </div>

      {/* Pricing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-muted rounded-full p-1 flex items-center">
          <button
            className={`px-6 py-2 rounded-full transition-all ${
              !isAnnual ? 'bg-white shadow-sm' : ''
            }`}
            onClick={() => setIsAnnual(false)}
          >
            Monthly
          </button>
          <button
            className={`px-6 py-2 rounded-full transition-all ${
              isAnnual ? 'bg-white shadow-sm' : ''
            }`}
            onClick={() => setIsAnnual(true)}
          >
            Annually
            {isAnnual && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Save 20%
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {pricingPlans.map((plan) => (
          <PaymentCard
            key={plan.id}
            planId={plan.id}
            paymentAmount={isAnnual ? plan.priceAnnually : plan.priceMonthly}
            planDetails={{
              isAnnual,
              title: plan.name,
              description: plan.description,
              features: plan.features.map(feature => ({
                name: feature,
                available: true
              })),
              tag: plan.popular ? 'Most Popular' : undefined
            }}
          />
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-20 text-center">
        <h3 className="text-2xl font-semibold mb-6">Need Help?</h3>
        <p className="text-muted-foreground mb-8">
          Have questions about our pricing plans? We're here to help!
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <a 
            href="mailto:tyagishashank118@gmail.com" 
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Mail className="h-5 w-5" />
            <span>support@conversly.ai</span>
          </a>
          
          <a 
            href="https://wa.me/+919528921966" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span>WhatsApp: +91 9528921966</span>
          </a>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Business hours: Monday to Friday, 3:00 - 18:00 UTC
        </p>
      </div>
    </div>
    </div>
  );
} 