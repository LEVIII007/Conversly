import { Upload, Settings, Zap } from "lucide-react"

const steps = [
  {
    title: "Input Data",
    description: "Add your website URL or upload documents to train your chatbot.",
    icon: Upload,
  },
  {
    title: "Customize",
    description: "Adjust settings, tone, and behavior to match your needs.",
    icon: Settings,
  },
  {
    title: "Deploy",
    description: "Embed your chatbot with a simple code snippet.",
    icon: Zap,
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how_it_works"
      className="bg-gradient-to-b from-neutral-900 to-neutral-950 py-32"
      aria-labelledby="section-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 reveal-on-scroll">
          <h2
            id="section-title"
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-neutral-200 bg-clip-text text-transparent mb-8 leading-tight"
          >
            How ConverslyAI Works
          </h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed font-light">
            Create your custom AI chatbot in three simple steps. No coding required.
          </p>
        </div>

        {/* Steps Container */}
        <div className="space-y-24">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-3xl -z-10"></div>
              <div className="bg-neutral-800/80 backdrop-blur-sm rounded-3xl p-10 border border-neutral-700/50 max-w-4xl mx-auto transform hover:scale-[1.02] transition-all duration-300 shadow-2xl">
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="lg:w-2/5">
                    <span className="inline-block text-indigo-400 font-medium mb-4">Step {index + 1}</span>
                    <h3 className="text-3xl font-bold text-white mb-6 leading-tight">{step.title}</h3>
                    <p className="text-neutral-300 text-lg mb-8 leading-relaxed">{step.description}</p>
                  </div>
                  <div className="lg:w-3/5 flex items-center justify-center">
                    <step.icon className="w-32 h-32 text-indigo-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

