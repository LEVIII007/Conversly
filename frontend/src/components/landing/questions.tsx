'use client';
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "How do I integrate my chatbot on my website?",
    answer:
      "Simply copy the embed code from your dashboard and paste it into your website's HTML. The chatbot will appear automatically!",
  },
  {
    question: "What types of documents can I use for training?",
    answer:
      "We support PDFs, Word documents, text files, and more. You can also train your chatbot directly on your website content.",
  },
  {
    question: "How accurate are the responses?",
    answer:
      "Our AI is trained on your specific content, ensuring highly accurate and relevant responses. You can also customize the behavior and tone.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes! We use enterprise-grade encryption and never share your data. Your content is used exclusively for training your chatbot.",
  },
  {
    question: "Can I customize the chatbot's appearance?",
    answer: "You can customize colors, fonts, and the overall design to match your brand identity.",
  },
]

export default function QuestionsSection() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

  return (
    <section id="FaQs" className="bg-gradient-to-br from-neutral-900 to-neutral-950 py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 relative">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl"></span>
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about ConverslyAI. Can't find the answer you're looking for? Reach out to our
            support team.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-neutral-800 rounded-lg overflow-hidden">
              <button
                className="flex justify-between items-center w-full p-4 text-left bg-neutral-800/50 hover:bg-neutral-800/70 transition-colors"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-lg font-medium text-white">{faq.question}</span>
                {activeAccordion === index ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </button>
              {activeAccordion === index && (
                <div className="p-4 bg-neutral-800/30">
                  <p className="text-neutral-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

