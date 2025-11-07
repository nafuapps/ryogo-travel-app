import { db } from "@ryogo-travel-app/db";
import { expenses } from "@ryogo-travel-app/db/schema";
import { eq } from "drizzle-orm";

export const expenseRepository = {
  //Get expenses by booking id
  async getExpensesByBookingId(bookingId: string) {
    return db.query.expenses.findMany({
      where: eq(expenses.bookingId, bookingId),
    })
  },
};