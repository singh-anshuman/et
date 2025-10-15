import { Transaction } from '../TransactionList/Transaction';

const Summary: React.FC<{ transactions: Transaction[] }> = ({
    transactions,
}) => {
    const getNehuOwnsAnshuAmount = (): string => {
        return transactions
            .reduce((total, txn) => {
                return total + (txn.nehu_owns_anshu || 0);
            }, 0)
            .toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
            });
    };
    return (
        <div
            style={{
                margin: '20px 0 20px 0',
                display: 'flex',
                justifyContent: 'right',
            }}
        >
            <h5>
                Nehu Owns Anshu: <b>{getNehuOwnsAnshuAmount()}</b>
            </h5>
        </div>
    );
};

export default Summary;
