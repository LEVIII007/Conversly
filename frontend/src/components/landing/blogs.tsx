"use client"

import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Book, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"

const articles = [
  {
    title: "Building AI-Powered Knowledge Bases",
    excerpt: "Learn how to transform your documentation into an intelligent knowledge base using AI.",
    readTime: "5 min read",
    category: "Tutorial",
    image: "/blog/knowledge-base.jpg",
    gradient: "from-pink-500/10 via-purple-500/10 to-blue-500/10",
  },
  {
    title: "Best Practices for Training Chatbots",
    excerpt: "Discover the key strategies to train more accurate and helpful AI assistants.",
    readTime: "7 min read",
    category: "Guide",
    image: "/blog/chatbot-training.jpg",
    gradient: "from-blue-500/10 via-purple-500/10 to-pink-500/10",
  },
  {
    title: "The Future of Customer Support",
    excerpt: "How AI is revolutionizing customer support and what it means for businesses.",
    readTime: "4 min read",
    category: "Insights",
    image: "/blog/customer-support.jpg",
    gradient: "from-purple-500/10 via-pink-500/10 to-blue-500/10",
  },
]

export default function RelatedArticles() {
  return (
    <section className="bg-black py-24 relative overflow-hidden" id="blog">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-500/20 via-background to-transparent opacity-30" />
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
            <Book className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Latest Articles
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Stay Updated with Our
            <span className="block bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Latest Insights
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Explore our collection of articles, tutorials, and guides to get the most out of your AI assistant.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
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
                className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient} opacity-30`} />
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-pink-500">{article.category}</span>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{article.readTime}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{article.title}</h3>
                  <p className="text-gray-400 mb-4">{article.excerpt}</p>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-400 transition-colors"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Hover Effect */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r ${article.gradient}
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl
                `} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

