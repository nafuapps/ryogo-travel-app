"use server"

import { writePermissions } from "@/lib/permissions"
import { feedbackServices } from "@ryogo-travel-app/api/services/feedback.services"
import { InsertProductFeedbackType } from "@ryogo-travel-app/db/schema"

export async function addFeedbackAction(data: InsertProductFeedbackType) {
  const currentUser = await writePermissions.allowAllUsers(data.agencyId)
  if (!currentUser) return

  const feedback = await feedbackServices.addProductFeedback(data)
  if (!feedback) return

  return feedback
}
