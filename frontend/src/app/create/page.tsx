"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { createChatBot } from "@/lib/process-data1"
import { SignInDialog } from "@/components/auth/SignInDialog"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { Bot } from "lucide-react"
import UpperHeader from "@/components/upperHeader"
import { chatbotSchema } from "@/lib/zod"
import { PromptGeneratorForm } from "@/components/PromptGeneratorForm"
// Zod schema for validation

export default function CreatePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { showSignIn, closeSignIn } = useAuthGuard()

  // Basic Info
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("you are a helpful assistant...")

  // Error state for form fields
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (fieldName: string, value: string) => {
    const fieldSchema = chatbotSchema.shape[fieldName as keyof typeof chatbotSchema.shape] // Validate individual field
    const result = fieldSchema.safeParse(value)

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: result.success ? "" : result.error.errors[0].message,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form data with Zod schema
    const result = chatbotSchema.safeParse({ name, description, systemPrompt })

    if (!result.success) {
      // Map validation errors to field names
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      setErrors(fieldErrors)
      setIsLoading(false)
      return
    }

    // Clear errors if validation passes
    setErrors({})

    try {
      const response = await createChatBot({
        name,
        description,
        System_Prompt: systemPrompt,
      })

      if (response.processingStatus === "success") {
        toast({
          title: "Success",
          description: "Chatbot created successfully!",
        })
        router.push(`/chatbot/${response.chatbot.id}`)
      }
    } catch (error: any) {
      if (error instanceof Error && error.message.includes("maximum number of chatbots")) {
        toast({
          title: "Error",
          description: "You have reached the maximum number of chatbots allowed.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create chatbot",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <UpperHeader />
      <div className="flex-1 flex flex-col items-center py-16">
        <div className="w-full max-w-3xl px-4">
          <div className="mb-12"></div>
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
              Create Your AI Assistant
            </h1>
            <p className="mt-3 text-muted-foreground text-lg">Design your perfect chatbot in minutes</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-2xl p-8 space-y-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

            <div className="relative space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/80">Name</label>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    validateField("name", e.target.value)
                  }}
                  placeholder="Enter a name for your chatbot"
                  className="bg-background/50 backdrop-blur-sm border-border/50"
                  required
                />
                {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/80">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    validateField("description", e.target.value)
                  }}
                  placeholder="Describe what your chatbot will help with"
                  className="bg-background/50 backdrop-blur-sm border-border/50"
                  required
                />
                {errors.description && <p className="mt-2 text-sm text-red-500">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/80">System Prompt</label>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => {
                    setSystemPrompt(e.target.value)
                    validateField("systemPrompt", e.target.value)
                  }}
                  placeholder="Define your chatbot's personality and behavior"
                  className="min-h-[150px] bg-background/50 backdrop-blur-sm border-border/50"
                  required
                />
                {errors.systemPrompt && <p className="mt-2 text-sm text-red-500">{errors.systemPrompt}</p>}
                <p className="mt-2 text-sm text-muted-foreground">
                  This prompt shapes your chatbot's personality and expertise. Be specific about its role and how it
                  should interact.
                </p>
              </div>
              <PromptGeneratorForm />

              <Button
                type="submit"
                className="w-full h-12 text-lg font-medium bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Chatbot"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <SignInDialog isOpen={showSignIn} onClose={closeSignIn} />
    </div>
  )
}

