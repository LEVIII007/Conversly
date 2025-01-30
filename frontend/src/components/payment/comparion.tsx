'use client'

import React from "react"
import { useTheme } from "next-themes"

const plans = [
  { name: "Basic Plan", highlight: false },
  { name: "Pro Plan", highlight: true },
  { name: "Premium Plan", highlight: false },
]

const features = [
  { name: "Chatbots", values: ["3 Chatbots", "10 Chatbots", "Unlimited"] },
  { name: "Analytics", values: ["Basic Analytics", "Advanced Analytics", "Enterprise Analytics"] },
  { name: "Support Level", values: ["Email Support", "Priority Support", "24/7 Support"] },
  { name: "Monthly Messages", values: ["100k", "500k", "Unlimited"] },
  { name: "Integrations", values: ["Standard", "All Integrations", "Custom Integrations"] },
  { name: "Custom Branding", values: [false, true, true] },
  { name: "Account Manager", values: [false, false, true] },
]

const FeatureComparison = () => {
  const { theme } = useTheme()

  return (
    <section id="featureComparison" className="py-20 bg-gradient-to-b from-gray-100 to-black dark:from-gray-900 dark:to-black">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-16 animate__animated animate__fadeIn">
          <h2 className="text-3xl font-bold text-foreground">Compare Features Across Plans</h2>
          <p className="mt-4 text-xl text-muted-foreground">Find the perfect plan for your business needs</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-card shadow-lg rounded-lg overflow-hidden animate__animated animate__fadeInUp">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-6 py-4 text-left">Features</th>
                {plans.map((plan, index) => (
                  <th
                    key={index}
                    className={`px-6 py-4 text-center ${plan.highlight ? "bg-blue-600 text-white" : ""}`}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50">
                  <td className="px-6 py-4 font-medium text-foreground">{feature.name}</td>
                  {feature.values.map((value, i) => (
                    <td key={i} className={`px-6 py-4 text-center ${plans[i].highlight ? "bg-blue-100 dark:bg-blue-900" : ""}`}>
                      {typeof value === "boolean" ? (
                        value ? (
                          <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )
                      ) : (
                        <span className="text-foreground">{value}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 text-center">
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors animate__animated animate__pulse animate__infinite">
            Choose Your Plan Now
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeatureComparison
