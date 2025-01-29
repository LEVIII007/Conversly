import type React from "react"
import { BackgroundPattern } from "@/components/ui/background-pattern"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Shiddhesh Srirame",
    role: "Code2Tech Founder",
    quote:
      "ConverslyAI has transformed how our team manages customer inquiries. The chatbot is intuitive, and the customization options help us maintain our brand voice.",
    initials: "S",
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-500",
  },
  {
    name: "Raghvendra Singh",
    role: "Git Buddy Founder",
    quote:
      "The efficiency gains we've seen since implementing ConverslyAI are remarkable. It's become an essential tool for our customer support workflow.",
    initials: "M",
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-500",
  },
  {
    name: "Nenavath Chandra",
    role: "TechSavvy Founder",
    quote:
      "ConverslyAI's approach to AI-powered chatbots is refreshingly modern. The integration was smooth, and the results have been impressive.",
    initials: "A",
    bgColor: "bg-green-500/20",
    textColor: "text-green-500",
  },
]

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="relative py-24 bg-background overflow-hidden">
      <BackgroundPattern className="opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-primary text-sm font-semibold mb-2">TESTIMONIALS</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Trusted by leading teams</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what teams are saying about their experience with ConverslyAI.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card/5 border border-border rounded-xl p-8 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full ${testimonial.bgColor} flex items-center justify-center`}>
                    <span className={`text-xl font-semibold ${testimonial.textColor}`}>{testimonial.initials}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-foreground font-medium">{testimonial.name}</h4>
                  <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}