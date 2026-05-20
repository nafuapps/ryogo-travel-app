"use client"

import Script from "next/script"
import { createOrderAction } from "@/app/actions/orders/createOrderAction"
import { verifyOrderAction } from "@/app/actions/orders/verifyOrderAction"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { OrderTypeEnum } from "@ryogo-travel-app/db/schema"
import { useTransition } from "react"
import { toast } from "sonner"

export default function PaymentButton({
  agencyId,
  userId,
  plan,
  ownerName,
  ownerEmail,
  ownerPhone,
  renewLabel,
  icon,
}: {
  agencyId: string
  userId: string
  plan: OrderTypeEnum
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  renewLabel: string
  icon?: React.ReactNode
}) {
  const t = useTranslations("Dashboard.AccountSubscription.PaymentButton")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handlePayment = async () => {
    startTransition(async () => {
      const createdOrder = await createOrderAction(agencyId, userId, plan)
      if (!createdOrder) return

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID,
        // key: process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID,
        currency: "INR",
        name: "RyoGo Travel App",
        description: `Premium Subscription - ${plan} Plan`,
        amount: createdOrder.amount,
        order_id: createdOrder.rpOrderId,
        // UPI optimization - set as default method
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        handler: async function (response: any) {
          // Handle post-payment verification (Client Side)
          try {
            // Trigger the Server Action for verification
            const result = await verifyOrderAction({
              rpOrderId: createdOrder.rpOrderId,
              rpPaymentId: response.razorpay_payment_id,
              rpSignature: response.razorpay_signature,
              agencyId,
              userId,
            })

            if (result) {
              //Payment successful.. DB update successful
              toast.success(t("Success"))
            } else {
              //Payment successful.. DB update failed .. waiting for webhook
              toast.info(t("WaitDB"))
            }
            router.refresh() // Refresh server components to show Premium UI
          } catch (err) {
            //Payment verification failed
            toast.error(t("Error"))
          }
        },
        prefill: {
          name: ownerName,
          email: ownerEmail,
          phone: ownerPhone,
        },
        theme: { color: "#2563eb" }, // Your brand color
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    })
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Button onClick={handlePayment} variant={"brand"} disabled={isPending}>
        {renewLabel}
        {icon}
      </Button>
    </>
  )
}
