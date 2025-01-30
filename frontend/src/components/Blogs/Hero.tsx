import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section id="hero" className="bg-neutral-900 text-white min-h-[70vh] flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Why Businesses Need AI Chatbots in 2025
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Transform your business with AI-powered chatbots. Scale customer engagement, automate workflows, and stay ahead in the digital age.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#keyBenefits" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
                Explore Benefits
              </a>
              <a href="#callToAction" className="bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all">
                Try Now
              </a>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30"></div>
              <div className="relative bg-neutral-800 p-6 rounded-lg border border-neutral-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <ChatBubble user={false} text="Hello! How can I assist you today?" />
                  <ChatBubble user={true} text="I need help with customer support." />
                  <ChatBubble user={false} text="I'd be happy to help! What specific aspect of customer support do you need assistance with?" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="mt-16 flex justify-center gap-8 text-gray-400 text-sm">
          <Stat label="24/7" text="Support" />
          <Stat label="30%" text="Cost Reduction" />
          <Stat label="40%" text="Higher Conversion" />
        </div>
      </div>
    </section>
  );
};

interface ChatBubbleProps {
  user: boolean;
  text: string;
}

const ChatBubble = ({ user, text }: ChatBubbleProps) => (
  <div className={`flex gap-4 ${user ? "justify-end" : ""}`}>
    {!user && <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">🤖</div>}
    <div className={`flex-1 p-3 rounded-lg ${user ? "bg-blue-500" : "bg-neutral-700"}`}>
      <p className="text-sm">{text}</p>
    </div>
    {user && <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">👤</div>}
  </div>
);

interface StatProps {
  label: string;
  text: string;
}

const Stat = ({ label, text }: StatProps) => (
  <div className="flex items-center gap-2">
    <span className="text-blue-400 font-bold">{label}</span> {text}
  </div>
);

export default HeroSection;
