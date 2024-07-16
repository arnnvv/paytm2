import { Balance } from "@repo/db/schema";
import { validateRequest } from "../../../lib/auth";
import AddMoneyCard from "../../_components/AddMoneyCard";
import BalanceCard from "../../_components/BalanceCard";
import Onramptransaction from "../../_components/Onramptransaction";
import { getBalance, getTransactions } from "../../../actions";

export default async (): Promise<JSX.Element> => {
  const { user } = await validateRequest();
  const balance: Balance | undefined = await getBalance(user?.id);
  const transactions = await getTransactions(user?.id);

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
          <BalanceCard amount={balance?.amount} locked={balance?.locked} />
          <div className="pt-4">
            <Onramptransaction transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
};
