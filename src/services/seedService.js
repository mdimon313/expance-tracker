import dayjs from "dayjs";
import { createTransaction } from "./transactionService";
import { createBudget } from "./budgetService";
import { createAccount } from "./accountService";
import { createSavings } from "./savingsService";

// Local, dev-only demo data generator. NOT a mock API - it writes real
// documents into the current user's Firestore subcollections via the same
// services the UI uses. Call once after first login during development.
export const seedDemoData = async () => {
  const cash = await createAccount({ name: "Cash", type: "cash", balance: 5200 });
  const bank = await createAccount({ name: "City Bank", type: "bank", accountNumber: "**** 4821", balance: 84200 });

  const categories = ["Food", "Transport", "Shopping", "Bills", "Entertainment"];
  for (let i = 0; i < 18; i++) {
    const isIncome = i % 7 === 0;
    await createTransaction({
      type: isIncome ? "income" : "expense",
      amount: isIncome ? 25000 : Math.round(150 + Math.random() * 2500),
      category: isIncome ? "Salary" : categories[i % categories.length],
      accountId: isIncome ? bank.id : i % 2 === 0 ? cash.id : bank.id,
      note: "",
      date: dayjs().subtract(i, "day").toISOString(),
    });
  }

  await createBudget({ category: "Food", amount: 8000, month: dayjs().format("YYYY-MM") });
  await createBudget({ category: "Transport", amount: 3000, month: dayjs().format("YYYY-MM") });
  await createSavings({ name: "Emergency Fund", targetAmount: 100000, currentAmount: 32000 });
};
