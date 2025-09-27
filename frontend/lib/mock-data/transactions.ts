import type { Transaction } from "../types"

export const mockTransactions: Transaction[] = [
  {
    id: "txn1001",
    orderId: "1001",
    amount: 5.6,
    paymentMethod: "credit_card",
    status: "completed",
    customerName: "Alice Johnson",
    locationId: "1",
    cashierId: "4",
    createdAt: new Date(Date.now() - 5 * 60000),
  },
  {
    id: "txn1002",
    orderId: "1002",
    amount: 10.25,
    paymentMethod: "cash",
    status: "completed",
    customerName: "Bob Smith",
    locationId: "1",
    cashierId: "4",
    createdAt: new Date(Date.now() - 12 * 60000),
  },
]
