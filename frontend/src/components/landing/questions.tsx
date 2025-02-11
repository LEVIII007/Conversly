'use client';
import { useState } from "react"
import { ChevronDown, ChevronUp, HelpCircle, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const faqs = [
  {
    question: "How do I integrate my chatbot on my website?",
    answer:
      "Simply copy the embed code from your dashboard and paste it into your website's HTML. The chatbot will appear automatically!",
    category: "Integration",
    gradient: "from-pink-500/10 via-purple-500/10 to-blue-500/10",
  },
  {
    question: "What types of documents can I use for training?",
    answer:
      "We support PDFs, Word documents, text files, and more. You can also train your chatbot directly on your website content.",
    category: "Training",
    gradient: "from-blue-500/10 via-purple-500/10 to-pink-500/10",
  },
  {
    question: "How accurate are the responses?",
    answer:
      "Our AI is trained on your specific content, ensuring highly accurate and relevant responses. You can also customize the behavior and tone.",
    category: "Performance",
    gradient: "from-purple-500/10 via-pink-500/10 to-blue-500/10",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes! We use enterprise-grade encryption and never share your data. Your content is used exclusively for training your chatbot.",
    category: "Security",
    gradient: "from-pink-500/10 via-blue-500/10 to-purple-500/10",
  },
  {
    question: "Can I customize the chatbot's appearance?",
    answer: "You can customize colors, fonts, and the overall design to match your brand identity.",
  },
]

export default function QuestionsSection() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

  return (
    <section className="bg-black py-24 relative overflow-hidden" id="faq">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-background to-transparent opacity-30" />
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
            <HelpCircle className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              FAQ
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Got
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text mx-3">
              Questions
            </span>
            ?
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            Find answers to common questions about our platform.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative mb-12">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-xl px-12 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-4"
        >
          {filteredFaqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-purple-500/10 rounded-xl" />
              <motion.div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800/60 rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-500">
                      {faq.category}
                    </span>
                    <span className="text-white font-medium">{faq.question}</span>
                  </div>
                  {activeAccordion === index ? (
                    <ChevronUp className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {activeAccordion === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-4">
                        <div className={`p-4 rounded-lg bg-gradient-to-br ${faq.gradient}`}>
                          <p className="text-gray-200">{faq.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

