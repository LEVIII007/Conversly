// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useToast } from '@/hooks/use-toast';
// import { pricingPlans } from '@/lib/pricing-constants';
// import PaymentCard from '@/components/payment/payment-card';
// import Script from 'next/script';
// import UpperHeader from '@/components/upperHeader';
// import { Mail, MessageCircle } from 'lucide-react';

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// export default function PricingPage() {
//   const [isAnnual, setIsAnnual] = useState(false);
//   const { data: session } = useSession();
//   const { toast } = useToast();

//     // Ensure Razorpay script is loaded
//     useEffect(() => {
//         if (!window.Razorpay) {
//           const script = document.createElement("script");
//           script.src = "https://checkout.razorpay.com/v1/checkout.js";
//           script.async = true;
//           document.body.appendChild(script);
//           script.onload = () => console.log("Razorpay script loaded successfully");
//           script.onerror = () => console.error("Failed to load Razorpay script");
//         }
//       }, []);

//   return (
//     <div>
//         <UpperHeader />
//     <div className="container mx-auto px-4 py-16">
//       <div className="text-center mb-12">
//         <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
//         <p className="text-xl text-muted-foreground">
//           Choose the perfect plan for your chatbot needs
//         </p>
//       </div>

//       {/* Pricing Toggle */}
//       <div className="flex justify-center mb-12">
//         <div className="bg-muted rounded-full p-1 flex items-center">
//           <button
//             className={`px-6 py-2 rounded-full transition-all ${
//               !isAnnual ? 'bg-white shadow-sm' : ''
//             }`}
//             onClick={() => setIsAnnual(false)}
//           >
//             Monthly
//           </button>
//           <button
//             className={`px-6 py-2 rounded-full transition-all ${
//               isAnnual ? 'bg-white shadow-sm' : ''
//             }`}
//             onClick={() => setIsAnnual(true)}
//           >
//             Annually
//             {isAnnual && (
//               <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
//                 Save 20%
//               </span>
//             )}
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
//         {pricingPlans.map((plan) => (
//           <PaymentCard
//             key={plan.id}
//             planId={plan.id}
//             paymentAmount={isAnnual ? plan.priceAnnually : plan.priceMonthly}
//             planDetails={{
//               isAnnual,
//               title: plan.name,
//               description: plan.description,
//               features: plan.features.map(feature => ({
//                 name: feature,
//                 available: true
//               })),
//               tag: plan.popular ? 'Most Popular' : undefined
//             }}
//           />
//         ))}
//       </div>

//       {/* Contact Section */}
    //   <div className="mt-20 text-center">
    //     <h3 className="text-2xl font-semibold mb-6">Need Help?</h3>
    //     <p className="text-muted-foreground mb-8">
    //       Have questions about our pricing plans? We're here to help!
    //     </p>
        
    //     <div className="flex flex-col md:flex-row items-center justify-center gap-8">
    //       <a 
    //         href="mailto:tyagishashank118@gmail.com" 
    //         className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
    //       >
    //         <Mail className="h-5 w-5" />
    //         <span>support@conversly.ai</span>
    //       </a>
          
    //       <a 
    //         href="https://wa.me/+919528921966" 
    //         target="_blank" 
    //         rel="noopener noreferrer" 
    //         className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
    //       >
    //         <MessageCircle className="h-5 w-5" />
    //         <span>WhatsApp: +91 9528921966</span>
    //       </a>
    //     </div>

    //     <p className="mt-6 text-sm text-muted-foreground">
    //       Business hours: Monday to Friday, 3:00 - 18:00 UTC
    //     </p>
    //   </div>
    // </div>
    // </div>
//   );
// } 


'use client';

declare global {
  interface Window {
    Razorpay: any;
  }
}


import { useState, useEffect } from "react"
import { pricingPlans } from "@/lib/pricing-constants"
import PaymentCard from "@/components/payment/payment-card"
import Script from 'next/script';


// import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import HeroSection from "@/components/payment/payment-hero";
import Header from "@/components/Header";
import UpperHeader from "@/components/upperHeader";
import FeatureComparison from "@/components/payment/comparion";
import TrustSignals from "@/components/payment/trust-signals";
// import { pricingPlans } from '@/lib/pricing-constants';
// import PaymentCard from '@/components/payment/payment-card';
// import Script from 'next/script';
// import UpperHeader from '@/components/upperHeader';
import { Mail, MessageCircle } from 'lucide-react';


export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      document.body.appendChild(script)
      script.onload = () => console.log("Razorpay script loaded successfully")
      script.onerror = () => console.error("Failed to load Razorpay script")
    }
  }, [])

  return (
    <section id="pricingPlans" className="py-20 bg-white">
      <UpperHeader />
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate__animated animate__fadeIn">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600">Select the perfect plan for your business needs</p>

          <div className="flex items-center justify-center mt-8 space-x-4">
            <span className="text-lg font-medium text-gray-700">Monthly</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isAnnual}
                onChange={() => setIsAnnual(!isAnnual)}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span className="text-lg font-medium text-gray-700">
              Annual <span className="text-green-500 text-sm">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-2xl p-8 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ${
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
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-gray-600 mt-2">{plan.description}</p>
              <div className="mt-6">
                <div className={isAnnual ? "hidden" : ""}>
                  <span className="text-4xl font-bold">${plan.priceMonthly.toFixed(2)}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <div className={isAnnual ? "" : "hidden"}>
                  <span className="text-4xl font-bold">${(plan.priceAnnually / 12).toFixed(2)}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
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
      

    </section>
  )
}

