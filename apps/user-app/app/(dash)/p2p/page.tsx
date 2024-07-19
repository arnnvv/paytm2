import { getP2PTransfers } from "../../../actions";
import P2PTransactions from "../../_components/P2PTransactions";
import SendCard from "../../_components/SendCard";

export default async (): Promise<JSX.Element> => {
  const p2pTransaction = await getP2PTransfers();
  return (
    <div className="w-full">
      <SendCard />
      <P2PTransactions p2pTransactions={p2pTransaction} />
    </div>
  );
};
