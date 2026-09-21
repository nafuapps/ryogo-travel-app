"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { feedbackServices } from "@ryogo-travel-app/api/services/feedback.services"
import { InsertProductFeedbackType } from "@ryogo-travel-app/db/schema"

export async function addFeedbackAction(data: InsertProductFeedbackType) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== data.userId ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const feedback = await feedbackServices.addProductFeedback(data)
  if (!feedback) return

  return feedback
}
