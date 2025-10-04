import { transactionRepository } from "../repositories/transaction.repo";

export const transactionServices = {
  //Get previous N days transactions
  async getTransactionsPreviousDays(agencyId: string, days: number = 1) {
    //Day N days ago
    const startDate = new Date(
      new Date().getTime() - days * 24 * 60 * 60 * 1000
    );
    //Day today
    const endDate = new Date();

    const transactions =
      await transactionRepository.getTransactionsByCreatedRange(
        agencyId,
        startDate,
        endDate
      );
    return transactions.map((transaction) => {
      return {
        id: transaction.id,
        createdAt: transaction.createdAt,
        type: transaction.type,
        amount: transaction.amount,
      };
    });
  },
};
