import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation";

export default function Hero() {
  return (
    <div className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 flex items-center min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="relative">
          <span className="inline-block px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium mb-6">
            ✨ AI-Powered Customer Interactions
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
            Custom Chatbots for
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              Smarter Business
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-neutral-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Elevate your customer experience with AI chatbots trained on your unique business knowledge.
            <br />
            <span className="text-neutral-400">Seamless integration. 24/7 support. Instant answers.</span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="bg-indigo-600 text-white hover:bg-indigo-500"
              onClick={() => redirect('/create')}
            >
              Get Started Free
              <span className="ml-2">→</span>
            </Button>
            <Button size="lg" variant="outline">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

