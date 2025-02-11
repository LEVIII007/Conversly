"use client"

import { Upload, Bot, BarChart } from "lucide-react"
import { motion } from "framer-motion"

const steps = [
  {
    title: "Connect Your Data",
    description: "Upload documents or connect your website to train your AI assistant with your knowledge base.",
    icon: Upload,
    stats: "40+",
    statsLabel: "Connectors Available",
    gradient: "from-pink-500/10 via-purple-500/10 to-blue-500/10",
    iconColor: "text-pink-500",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Deploy AI Assistant",
    description: "Embed on your website, integrate via API, or use our hosted solution for instant deployment.",
    icon: Bot,
    stats: "5min",
    statsLabel: "Average Setup Time",
    gradient: "from-blue-500/10 via-purple-500/10 to-pink-500/10",
    iconColor: "text-blue-500",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Track & Optimize",
    description: "Monitor usage, gather insights, and continuously improve your AI's performance.",
    icon: BarChart,
    stats: "99%",
    statsLabel: "Response Accuracy",
    gradient: "from-purple-500/10 via-pink-500/10 to-blue-500/10",
    iconColor: "text-purple-500",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-black py-24 relative overflow-hidden">
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How it works</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            We transform your knowledge base into an <span className="text-white">reliable and production-ready</span>{" "}
            AI-powered <span className="text-pink-500">answer engine optimized for accuracy</span>.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-purple-500/10 rounded-2xl" />
              <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6 h-full">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${step.gradient} mb-6`}
                >
                  <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 mb-6">{step.description}</p>

                {/* Stats */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-2xl font-bold text-pink-500">{step.stats}</span>
                  <span className="text-sm text-gray-400">{step.statsLabel}</span>
                </div>

                {/* Image/Preview */}
                <div className="relative rounded-xl overflow-hidden bg-gray-800/50">
                  <img
                    src={step.image || "/placeholder.svg"}
                    alt={`${step.title} preview`}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-purple-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

