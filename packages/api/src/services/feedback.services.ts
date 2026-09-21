import { InsertProductFeedbackType } from "@ryogo-travel-app/db/schema"
import { feedbackRepository } from "../repositories/feedback.repo"

export const feedbackServices = {
  async addProductFeedback(data: InsertProductFeedbackType) {
    return await feedbackRepository.createProductFeedback(data)
  },
}
