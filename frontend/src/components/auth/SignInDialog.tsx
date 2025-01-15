'use client';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogHeader
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot } from 'lucide-react';

interface SignInDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInDialog({ isOpen, onClose }: SignInDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="sr-only">Sign in to ChatbotAI</DialogTitle>
        </DialogHeader>
        <AnimatePresence>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-10"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>

            {/* Branding Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 text-center"
            >
              <div className="mx-auto w-12 h-12 mb-4 text-primary">
                <Bot size={48} />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Welcome to ChatbotAI</h2>
              <p className="text-muted-foreground">
                Empowering Your Conversations with AI
              </p>
            </motion.div>

            {/* Sign In Section */}
            <div className="p-6 space-y-6">
              <Button
                className="w-full py-6 text-base flex items-center gap-3"
                onClick={() => signIn('google', { callbackUrl: '/create' })}
              >
                <img src="/google.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </Button>

              {/* Marketing Points */}
              <div className="space-y-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  Join thousands of businesses using ChatbotAI
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <MarketingPoint
                    title="Custom AI Chatbots"
                    description="Train on your data"
                  />
                  <MarketingPoint
                    title="Easy Integration"
                    description="One line of code"
                  />
                  <MarketingPoint
                    title="Advanced Analytics"
                    description="Track performance"
                  />
                  <MarketingPoint
                    title="24/7 Support"
                    description="Always available"
                  />
                </div>
              </div>
            </div>
          </div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function MarketingPoint({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center p-3 rounded-lg bg-muted/50">
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
} 