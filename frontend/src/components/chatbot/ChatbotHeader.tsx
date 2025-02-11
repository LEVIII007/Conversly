import { Bot, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function ChatbotHeader({ chatbot }: { chatbot: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative border-b border-gray-800/60"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent" />
      
      <div className="container relative py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10">
              <Bot className="w-8 h-8 text-pink-500" />
            </div>
            
            <div>
              <h1 className="font-heading text-2xl font-bold text-white mb-1">
                {chatbot.name}
              </h1>
              <p className="font-sans text-base text-gray-400">
                {chatbot.description}
              </p>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="border-gray-800 text-white hover:bg-gray-800/50"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Assistant
          </Button>
        </div>
      </div>
    </motion.div>
  )
} 