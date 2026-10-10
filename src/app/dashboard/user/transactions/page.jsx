import TransactionsTable from "@/app/components/Dashboard/TransactionsTable";

export default function UserTransactions() {
  return (
    <TransactionsTable
      role="user"
      title="My Transactions"
      subtitle="Payments you have made to lawyers."
    />
  );
}