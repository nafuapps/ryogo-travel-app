import { db } from "@ryogo-travel-app/db"
import {
  supportQueries,
  InsertSupportQueryType,
} from "@ryogo-travel-app/db/schema"

export const supportQueryRepository = {
  async createSupportQuery(query: InsertSupportQueryType) {
    return await db.insert(supportQueries).values(query).returning()
  },
}
