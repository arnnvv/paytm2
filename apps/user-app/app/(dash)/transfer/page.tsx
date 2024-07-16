import AddMoneyCard from "../../_components/AddMoneyCard";
import BalanceCard from "../../_components/BalanceCard";
import Onramptransaction, {
  Transaction,
} from "../../_components/Onramptransaction";

const getOnRampTransactions = async (): Promise<Transaction[]> => {
  const transactions: Transaction[] = [];
  return transactions;
};

export default async (): Promise<JSX.Element> => {
  const transactions = await getOnRampTransactions();

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transfer
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <AddMoneyCard />
        </div>
        <div>
          <BalanceCard amount={1000} locked={100} />
          <div className="pt-4">
            <Onramptransaction transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
};
