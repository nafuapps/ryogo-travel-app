import { InsertProductFeedbackType } from "@ryogo-travel-app/db/schema"
import { feedbackRepository } from "../repositories/feedback.repo"

export const feedbackServices = {
  async addProductFeedback(data: InsertProductFeedbackType) {
    const [addedFeedback] = await feedbackRepository.createProductFeedback(data)
    if (!addedFeedback) {
      console.error(`Feedback could not be added: ${data}`)
      return
    }
    return addedFeedback
  },
}
