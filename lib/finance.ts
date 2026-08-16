export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
};

const STORAGE_KEY = "zora-finance-transactions";

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return [];

    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveTransactions(
  transactions: Transaction[]
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions)
  );
}

export function addTransaction(
  transaction: Omit<Transaction, "id">
) {
  const transactions = getTransactions();

  const newTransaction: Transaction = {
    ...transaction,
    id: crypto.randomUUID(),
  };

  saveTransactions([
    newTransaction,
    ...transactions,
  ]);

  return newTransaction;
}

export function deleteTransaction(id: string) {
  const transactions = getTransactions();

  saveTransactions(
    transactions.filter(
      (transaction) => transaction.id !== id
    )
  );
}

export function getFinanceTotals(
  transactions: Transaction[]
) {
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  return {
    income,
    expenses,
    balance: income - expenses,
  };
}