import { Transaction } from '../TransactionList/Transaction';
import TransactionCard from './TransactionCard';

const TransactionCards: React.FC<{ transactions: Transaction[] }> = ({
    transactions,
}) => {
    return (
        <>
            {transactions.map((transaction) => (
                <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                />
            ))}
        </>
    );
};

export default TransactionCards;
