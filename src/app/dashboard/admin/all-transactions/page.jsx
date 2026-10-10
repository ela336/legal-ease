import TransactionsTable from "@/app/components/Dashboard/TransactionsTable";

export default function AllTransactions() {
  return (
    <TransactionsTable
      role="admin"
      title="All Transactions"
      subtitle="Every payment made on the platform."
    />
  );
}