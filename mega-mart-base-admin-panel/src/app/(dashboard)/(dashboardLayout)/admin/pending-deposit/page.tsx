import PendingDepositTable from "@/components/tables/PendingDepositTable";

export const metadata = {
  title: 'Pending Deposits | Meta Mart',
  description: 'Review and manage pending deposits in your Meta Mart admin panel.',
}

const PendingDeposit = () => {
  return (
    <div className="py-6 p-2 sm:p-4">
      <h3 className="text-3xl font-semibold mb-2 opacity-90">
        Pending Deposits
      </h3>
      <p className="text-sm opacity-60 mb-8">
        Review and manage deposits awaiting approval
      </p>

      <PendingDepositTable />
    </div>
  );
};

export default PendingDeposit;
