"use server"

import { SUPPORT_EMAIL } from "@/lib/uiConfig"
import webpush from "web-push"

webpush.setVapidDetails(
  `mailto:${SUPPORT_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

let subscription: PushSubscription | null = null

export async function subscribeUserAction(sub: PushSubscription) {
  subscription = sub
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true }
}

export async function unsubscribeUserAction() {
  subscription = null
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true }
}

export async function sendNotificationAction(message: string) {
  if (!subscription) {
    throw new Error("No subscription available")
  }

  try {
    await webpush.sendNotification(
      subscription as any,
      JSON.stringify({
        title: "Test Notification",
        body: message,
        icon: "/logoPWA.png",
      }),
    )
    return { success: true }
  } catch (error) {
    console.error("Error sending push notification:", error)
    return { success: false, error: "Failed to send notification" }
  }
}
