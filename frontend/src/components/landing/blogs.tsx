"use client"

import React, { useEffect, useRef } from "react"

const articles = [
  {
    id: 'how?',
    emoji: "🤖",
    category: ["AI", "Technology"],
    categoryColors: ["bg-blue-500/20 text-blue-400", "bg-purple-500/20 text-purple-400"],
    title: "The Future of AI in Customer Service: 2025 and Beyond",
    description: "Discover how AI is revolutionizing customer service and what to expect in the coming years.",
    link: "/blog/how",
  },
  {
    id: 'creating-your-first-chatbot',
    emoji: "💡",
    category: ["Business", "ROI"],
    categoryColors: ["bg-green-500/20 text-green-400", "bg-yellow-500/20 text-yellow-400"],
    title: "Maximizing ROI with AI Chatbot Implementation",
    description: "Learn how businesses are achieving significant returns on their AI chatbot investments.",
    link: "/blog/creating-your-first-chatbot",
  },
  {
    id: 3,
    emoji: "📈",
    category: ["Growth", "Strategy"],
    categoryColors: ["bg-red-500/20 text-red-400", "bg-blue-500/20 text-blue-400"],
    title: "Scaling Your Business with AI-Powered Solutions",
    description: "Strategic insights on leveraging AI chatbots for sustainable business growth.",
    link: "#",
  },
]

const ArticleCard = ({ emoji, category, categoryColors, title, description, link }: any) => (
  <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 opacity-0 translate-y-8 animate-fade-in-up">
    <div className="bg-neutral-700 h-48 flex items-center justify-center text-6xl">{emoji}</div>
    <div className="p-6">
      <div className="flex gap-2 mb-4">
        {category.map((cat: string, index: number) => (
          <span key={cat} className={`px-3 py-1 rounded-full text-sm ${categoryColors[index]}`}>
            {cat}
          </span>
        ))}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <a href={link} className="text-blue-400 hover:text-blue-300 inline-flex items-center">
        Read More
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
        </svg>
      </a>
    </div>
  </div>
)

export default function RelatedArticles() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
            entry.target.classList.remove("opacity-0", "translate-y-8")
          }
        })
      },
      { threshold: 0.1 },
    )

    const animatedElements = sectionRef.current?.querySelectorAll(".animate-fade-in-up")
    animatedElements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="relatedArticles" className="bg-neutral-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 -translate-y-4 animate-fade-in-down">
            Related Articles
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto opacity-0 -translate-y-4 animate-fade-in-down animation-delay-200">
            Explore more insights about AI chatbots and business automation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      </div>
    </section>
  )
}

