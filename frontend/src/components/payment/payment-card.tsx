"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { createOrder, verifyPayment } from "@/lib/razorpay"

interface PaymentCardProps {
  planId: string
  paymentAmount: number
  planDetails: {
    name: string
    isAnnual: boolean
  }
}

export default function PaymentCard({ planId, paymentAmount, planDetails }: PaymentCardProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()
  const { data: session } = useSession()

  const handlePayment = () => {
    startTransition(async () => {
      try {
        if (!session) {
          toast({
            title: "Error",
            description: "User not Logged in.",
            variant: "destructive",
          })
          return router.push("/")
        }
        const order = await createOrder(planId, paymentAmount, planDetails.isAnnual)
        if (!order.success) {
          if (order.message === "User already subscribed") {
            toast({
              title: "Error",
              description: "User already subscribed.",
              className: "bg-green-200",
            })
            return router.push("/profile")
          }
          if (order.message === "User not Logged in") {
            toast({
              title: "Error",
              description: "User not Logged in.",
              variant: "destructive",
            })
            return router.push("/")
          }
          toast({
            title: "Error",
            description: "Invalid subscription amount.",
            variant: "destructive",
          })
          return
        }
        toast({
          title: "Order created",
          description: "Order created successfully, please wait for payment.",
          className: "bg-green-400",
        })
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.order?.amount,
          currency: order.order?.currency,
          name: "Conversly.AI",
          description: planDetails.name,
          order_id: order.order?.id,
          handler: async (response: {
            razorpay_payment_id: string
            razorpay_order_id: string
            razorpay_signature: any
          }) => {
            const verify = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              planId,
              planDetails.isAnnual,
            )
            if (!verify.success) {
              toast({
                title: "Error",
                description: "Something went wrong. Please try again later.",
                variant: "destructive",
              })
              return
            }
            toast({
              title: "Payment Successful",
              description: "Payment successful. Thank you for your purchase.",
              className: "bg-green-400",
            })
          },
          prefill: {
            name: session?.user?.name,
            email: session?.user?.email,
          },
          theme: {
            color: "#3399cc",
          },
        }
        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      } catch (error) {
        console.error("Error creating order:", error)
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <button
      onClick={handlePayment}
      className={`w-full mt-8 text-white rounded-lg py-3 font-semibold transition-colors ${
        planDetails.name === "Pro Plan"
          ? "bg-blue-600 hover:bg-blue-700 animate__animated animate__pulse animate__infinite"
          : "bg-gray-900 hover:bg-gray-800"
      }`}
      disabled={isPending}
    >
      {isPending ? "Processing..." : "Get Started"}
    </button>
  )
}

