'use client';
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Zap, Users, Globe, Cpu } from "lucide-react"

const stats = [
  {
    value: "99.9%",
    label: "Uptime SLA",
    icon: Zap,
    gradient: "from-pink-500/10 via-purple-500/10 to-blue-500/10",
    iconColor: "text-pink-500",
  },
  {
    value: "150K+",
    label: "Active Users",
    icon: Users,
    gradient: "from-blue-500/10 via-purple-500/10 to-pink-500/10",
    iconColor: "text-blue-500",
  },
  {
    value: "50ms",
    label: "Response Time",
    icon: Globe,
    gradient: "from-purple-500/10 via-pink-500/10 to-blue-500/10",
    iconColor: "text-purple-500",
  },
  {
    value: "1B+",
    label: "API Requests",
    icon: Cpu,
    gradient: "from-pink-500/10 via-blue-500/10 to-purple-500/10",
    iconColor: "text-pink-500",
  },
]

export default function ScalabilitySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0])

  return (
    <section className="bg-black py-24 relative overflow-hidden" ref={containerRef}>
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/30 via-background to-transparent"
        style={{ y, opacity }}
      />
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(black,transparent_70%)]" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            animate={{
              x: ["0vw", "100vw"],
              y: [Math.random() * 100 + "vh", Math.random() * 100 + "vh"],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear",
              delay: -Math.random() * 20,
            }}
            style={{ opacity: Math.random() * 0.5 + 0.2 }}
          />
        ))}
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 mb-6">
            <Cpu className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Enterprise Ready
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built for
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text ml-3">
              Scale
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Handle millions of requests with ease. Our infrastructure is built to scale with your needs.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-purple-500/10 rounded-2xl" />
              <motion.div 
                className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl p-6 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} mx-auto mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <motion.span 
                  className="text-3xl font-bold text-white block mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.3, type: "spring" }}
                >
                  {stat.value}
                </motion.span>
                <span className="text-gray-400">{stat.label}</span>

                {/* Hover Effect */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r ${stat.gradient}
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl
                `} />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Graph Visualization */}
        <motion.div 
          className="mt-16 h-64 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent rounded-xl" />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          {/* Add more graph elements here */}
        </motion.div>
      </div>
    </section>
  )
} 