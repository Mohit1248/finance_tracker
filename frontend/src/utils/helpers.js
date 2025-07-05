export const calculateTotal = (transactions, type) =>
  transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);