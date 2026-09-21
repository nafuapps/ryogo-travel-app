import { db } from "@ryogo-travel-app/db"
import {
  productFeedbacks,
  InsertProductFeedbackType,
} from "@ryogo-travel-app/db/schema"
import { eq } from "drizzle-orm"

export const feedbackRepository = {
  //Create a new feedback
  async createProductFeedback(data: InsertProductFeedbackType) {
    return await db.insert(productFeedbacks).values(data).returning()
  },
}
