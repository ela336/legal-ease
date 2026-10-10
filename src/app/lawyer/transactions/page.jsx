import TransactionsTable from "@/app/components/Dashboard/TransactionsTable";

export default function LawyerTransactions() {
  return (
    <TransactionsTable
      role="lawyer"
      title="My Earnings"
      subtitle="Payments you have received from clients."
    />
  );
}