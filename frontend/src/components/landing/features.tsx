import { Globe, Upload, Settings, Code } from "lucide-react"

const features = [
  {
    title: "Website Chatbots",
    description: "Train your chatbot on your website's content for instant, accurate responses.",
    icon: Globe,
  },
  {
    title: "Document-Based Chatbots",
    description: "Upload PDFs and files to create knowledgeable AI assistants.",
    icon: Upload,
  },
  {
    title: "Customizable AI",
    description: "Set tone, personality, and system prompts to match your brand.",
    icon: Settings,
  },
  {
    title: "Easy Embedding",
    description: "Integrate chatbots on your website with just a few lines of code.",
    icon: Code,
  },
]

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="features-section bg-gradient-to-b from-neutral-900 to-neutral-950 py-32"
      aria-labelledby="features-heading"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <header className="text-center mb-16">
          <h2
            id="features-heading"
            className="text-4xl md:text-5xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
          >
            Powerful Features for Modern Businesses
          </h2>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            Transform your website into an intelligent assistant. Let it handle customer queries with precision and speed.
          </p>
        </header>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-neutral-800/50 rounded-lg p-6 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <feature.icon className="w-12 h-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-neutral-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

