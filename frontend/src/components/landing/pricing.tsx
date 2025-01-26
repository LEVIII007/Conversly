import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: [
      "1 Chatbot",
      "1,000 messages/month",
      "Basic customization",
      "Community support",
      "limited Data Sources",
      "Limited Embedding",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    features: [
      "Unlimited chatbots",
      "Unlimited messages",
      "Advanced customization",
      "Priority support",
      "Custom branding",
      "Analytics dashboard",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "Custom AI training",
      "Unlimited Data Sources",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-gradient-to-b from-neutral-950 to-neutral-900 py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-neutral-300">Choose the plan that's right for your business</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-neutral-800 rounded-lg p-8 shadow-lg ${
                plan.popular ? "border-2 border-indigo-500 relative" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg rounded-tr-lg">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-neutral-300">{plan.period}</span>}
              </div>
              <ul className="mb-8 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-neutral-300">
                    <Check className="w-5 h-5 mr-2 text-indigo-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
            href="/pricing"
            className="w-full block bg-indigo-600 hover:bg-indigo-500 text-center text-white py-2 px-4 rounded"
          >
            {plan.cta}
          </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

