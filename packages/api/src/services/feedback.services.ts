import { InsertProductFeedbackType } from "@ryogo-travel-app/db/schema"
import { feedbackRepository } from "../repositories/feedback.repo"

export const feedbackServices = {
  async addProductFeedback(data: InsertProductFeedbackType) {
    const [feedback] = await feedbackRepository.createProductFeedback(data)
    return feedback
  },
}
