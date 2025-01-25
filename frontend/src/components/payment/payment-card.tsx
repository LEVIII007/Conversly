"use client";
import React, { useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Script from "next/script";
import { createOrder, verifyPayment } from "@/lib/razorpay";
import { useRouter } from "next/navigation";
import { pricingPlans } from "@/lib/pricing-constants";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface PaymentCardProps {
  planId: string;
  paymentAmount: number;
  planDetails: {
    isAnnual : boolean;
    title: string;
    description: string;
    features: Feature[];
    tag?: string;
  };
}

interface Feature {
  name: string;
  available: boolean;
}

export default function PaymentCard({ planId, paymentAmount, planDetails }: PaymentCardProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  console.log("Payment Card called");
  console.log("PlanId:", planId);

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

  const handlePayment = () => {
    startTransition(async () => {
        console.log("Payment started");
      try {
        const order = await createOrder(planId, paymentAmount,  planDetails.isAnnual);
        if (!order.success) {
          if (order.message === "User already subscribed") {
            toast({
              title: "Error",
              description: "User already subscribed.",
              className: "bg-green-200",
            });
            return router.push("/profile");
          }
          if (order.message === "User not Logged in") {
            toast({
              title: "Error",
              description: "User not Logged in.",
              variant: "destructive",
            });
            return router.push("/");
          }
          toast({
            title: "Error",
            description: "Invalid subscription amount.",
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Order created",
          description: "Order created successfully, please wait for payment.",
          className: "bg-green-400",
        });
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.order?.amount,
          currency: order.order?.currency,
          name: "Conversly.AI",
          description: "Professional Plan",
          order_id: order.order?.id,
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            console.log(response);
            const verify = await verifyPayment(response.razorpay_order_id, 
                response.razorpay_payment_id,
                response.razorpay_signature,
                planId, planDetails.isAnnual);

            if (!verify.success) {
                toast({
                    title: "Error",
                    description: "Something went wrong. Please try again later.",
                    variant: "destructive",
                });
                return;
                }
            toast({ 
                title: "Payment Successful",
                description: "Payment successful. Thank you for your purchase.",
                className: "bg-green-400",
            });
          },
          prefill: {
            name: session?.user?.name, // Replace with dynamic user data
            email: session?.user?.email, // Replace with dynamic user data
          },
          theme: {
            color: "#3399cc",
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Error creating order:", error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      }
    });
  };


  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-primary/10 rounded-2xl blur-2xl" />
      <div className="relative bg-card border border-border rounded-2xl p-8 shadow-xl">
        {planDetails.tag && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
            {planDetails.tag}
          </div>
        )}

        <header className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary">{planDetails.title}</h2>
          <p className="text-muted-foreground">{planDetails.description}</p>
        </header>

        <div className="text-center mb-8">
          <p className="text-5xl font-bold text-primary">₹{paymentAmount}</p>
          <p className="text-muted-foreground">/month</p>
        </div>

        <ul className="space-y-4 mb-8">
          {planDetails.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-muted-foreground">
              {feature.available ? (
                <svg
                  className="w-5 h-5 text-primary flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-destructive flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <span className={!feature.available ? "text-muted-foreground/50" : ""}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>

        <button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-4 rounded-lg font-semibold shadow-lg shadow-primary/20 transition-all"
          onClick={handlePayment}
          disabled={isPending}
        >
          {isPending ? "Processing..." : "Get Started"}
        </button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          No credit card required • Cancel anytime
        </p>
      </div>
    </div>
  );
}