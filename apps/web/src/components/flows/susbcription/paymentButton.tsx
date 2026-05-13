"use client"

import Script from "next/script"
import { createOrderAction } from "@/app/actions/orders/createOrderAction"
import { verifyOrderAction } from "@/app/actions/orders/verifyOrderAction"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export default function PaymentButton({
  agencyId,
  amount,
  ownerName,
  ownerEmail,
  ownerPhone,
}: {
  agencyId: string
  amount: number
  ownerName: string
  ownerEmail: string
  ownerPhone: string
}) {
  const t = useTranslations("Dashboard.AccountSubscription.PaymentButton")
  const router = useRouter()

  const handlePayment = async () => {
    const newOrder = await createOrderAction(agencyId, amount)
    if (!newOrder) return

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID,
      // key: process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID,
      currency: "INR",
      name: "RyoGo Travel App",
      description: "Subscription Plan",
      amount,
      order_id: newOrder.rpOrderId,
      // UPI optimization - set as default method
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
      },
      handler: async function (response: any) {
        // Handle post-payment verification (Client Side)
        alert("Payment Successful! Verifying...")
        try {
          // Trigger the Server Action for verification
          const result = await verifyOrderAction({
            rpOrderId: newOrder.rpOrderId,
            rpPaymentId: response.razorpay_payment_id,
            rpSignature: response.razorpay_signature,
            agencyId,
          })

          if (result) {
            router.refresh() // Refresh server components to show Premium UI
          }
        } catch (err) {
          alert(
            "Verification failed. Our team will verify it manually if the amount was debited.",
          )
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
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Button onClick={handlePayment} variant={"brand"}>
        {t("PayMonthly")}
      </Button>
    </>
  )
}
