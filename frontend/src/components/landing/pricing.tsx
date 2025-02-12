"use client"

import { Check, Star } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import {redirect} from "next/navigation";

const pricingPlans = [
  {
    name: "Free",
    priceMonthly: "$0",
    description: "Perfect for trying out our platform",
    features: [
      "Up to 500 messages per month",
      "Basic AI customization",
      "Standard support",
      "Community access",
    ],
    gradient: "from-pink-500/10 via-purple-500/10 to-blue-500/10",
    stats: "0.5K",
    statsLabel: "Free Messages",
  },
  {
    name: "Pro",
    popular: true,
    priceMonthly: "$49",
    description: "Best for growing businesses",
    features: [
      "Up to 10,000 messages per month",
      "Advanced AI customization",
      "Priority support",
      "API access",
      "Custom branding",
      "Analytics dashboard",
    ],
    gradient: "from-blue-500/10 via-purple-500/10 to-pink-500/10",
    stats: "10K",
    statsLabel: "Messages/Month",
  },
  {
    name: "Enterprise",
    priceMonthly: "Custom",
    description: "For large-scale deployments",
    features: [
      "Unlimited messages",
      "Full AI customization",
      "24/7 dedicated support",
      "Custom integrations",
      "Advanced analytics",
      "SLA guarantee",
      "Custom training",
    ],
    gradient: "from-purple-500/10 via-pink-500/10 to-blue-500/10",
    stats: "∞",
    statsLabel: "Unlimited Scale",
  },
]

export default function PricingSection() {
  return (
    <section className="bg-black py-24 relative overflow-hidden" id="pricing">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-background to-transparent opacity-30" />
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(black,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Start free and <span className="text-white">scale as you grow</span>.{" "}
            <span className="text-pink-500">No hidden fees or surprises</span>.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-purple-500/10 rounded-2xl" />
              <div
                className={`
                relative bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-8
                ${plan.popular ? "ring-2 ring-pink-500/20" : ""}
              `}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-white">{plan.priceMonthly}</span>
                    {plan.priceMonthly !== "Custom" && <span className="text-gray-400">/month</span>}
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                {/* Stats */}
                <div className="flex items-baseline gap-2 mb-6 p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-800/60">
                  <span className="text-2xl font-bold text-pink-500">{plan.stats}</span>
                  <span className="text-sm text-gray-400">{plan.statsLabel}</span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 p-0.5 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20">
                        <Check className="w-4 h-4 text-pink-500" />
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={`/pricing?plan=${plan.name.toLowerCase()}`}
                  className={`
                    w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium
                    transition-all duration-300 group/button relative overflow-hidden
                    ${
                      plan.popular
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90"
                        : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                    }
                  `}
                >
                  <span className="relative z-10" onClick={redirect('/pricing')}>
                    {plan.popular ? "Get Started" : plan.priceMonthly === "Custom" ? "Contact Sales" : "Start Free"}
                  </span>
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-500" />
                </Link>

                {/* Hover Effect */}
                <div
                  className={`
                  absolute inset-0 bg-gradient-to-r ${plan.gradient}
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl
                `}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-2xl bg-gray-900/60 backdrop-blur-sm border border-gray-800/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-400 text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-gray-400 text-sm">99.9% Uptime SLA</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-gray-400 text-sm">Automatic Updates</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

