'use client';
import { Globe, Upload, Settings, Code, Zap, BarChart } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    title: "Website Integration",
    description: "Train your chatbot on your website's content for instant, accurate responses.",
    icon: Globe,
    stats: "98%",
    statsLabel: "Accuracy Rate",
    gradient: "from-pink-500/10 via-purple-500/10 to-blue-500/10",
    iconColor: "text-pink-500",
  },
  {
    title: "Document Processing",
    description: "Upload PDFs and files to create knowledgeable AI assistants.",
    icon: Upload,
    stats: "50+",
    statsLabel: "File Formats",
    gradient: "from-blue-500/10 via-purple-500/10 to-pink-500/10",
    iconColor: "text-blue-500",
  },
  {
    title: "Advanced Customization",
    description: "Set tone, personality, and system prompts to match your brand.",
    icon: Settings,
    stats: "100%",
    statsLabel: "Customizable",
    gradient: "from-purple-500/10 via-pink-500/10 to-blue-500/10",
    iconColor: "text-purple-500",
  },
  {
    title: "Simple Integration",
    description: "Integrate chatbots on your website with just a few lines of code.",
    icon: Code,
    stats: "5min",
    statsLabel: "Setup Time",
    gradient: "from-pink-500/10 via-blue-500/10 to-purple-500/10",
    iconColor: "text-pink-500",
  },
]

export default function FeaturesSection() {
  return (
    <section className="bg-black pt-12 pb-24 relative overflow-hidden" id="features">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-background to-transparent opacity-30" />
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(black,transparent_70%)]" />
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 mb-6">
            <Zap className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Powerful Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need to Build
            <span className="block bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Intelligent Assistants
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Transform your website into an intelligent assistant. Let it handle customer queries with precision and speed.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-purple-500/10 rounded-2xl" />
              <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6">
                {/* Icon & Stats */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${feature.gradient}`}>
                    <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${feature.iconColor}`}>{feature.stats}</span>
                    <span className="text-sm text-gray-400">{feature.statsLabel}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>

                {/* Hover Effect */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r ${feature.gradient}
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl
                `} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

