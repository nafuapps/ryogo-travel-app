import { db } from "@ryogo-travel-app/db";
import { transactions } from "@ryogo-travel-app/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export const transactionRepository = {
  //Get all transactions within a particular date range
  async getTransactionsByCreatedRange(
    agencyId: string,
    startDate: Date,
    endDate: Date
  ) {
    return db
      .select()
      .from(transactions)
      .where(
        and(
          gte(transactions.createdAt, startDate),
          lte(transactions.createdAt, endDate),
          eq(transactions.agencyId, agencyId)
        )
      );
  },
};
