import { useEffect, useState } from 'react';
import { Transaction } from '../TransactionList/Transaction';

const Summary: React.FC<{ transactions: Transaction[] }> = ({
    transactions,
}) => {
    const [nehuOwnsAnshuAmount, setNehuOwnsAnshuAmount] = useState<number>(0);

    useEffect(() => {
        setNehuOwnsAnshuAmount(getNehuOwnsAnshuAmount());
    }, [transactions]);

    const getNehuOwnsAnshuAmount = (): number => {
        return transactions
            .filter((txn) => !txn.is_settled)
            .reduce((total, txn) => {
                return total + (txn.nehu_owns_anshu || 0);
            }, 0);
    };
    return (
        <div
            style={{
                border: '1px solid lightgrey',
                padding: '10px 15px 6px 15px',
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'right',
            }}
        >
            <h5>
                Nehu Owns Anshu:{' '}
                <b
                    style={{
                        color:
                            nehuOwnsAnshuAmount > 0
                                ? 'green'
                                : nehuOwnsAnshuAmount < 0
                                  ? 'red'
                                  : 'blue',
                    }}
                >
                    {nehuOwnsAnshuAmount.toLocaleString('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                    })}
                </b>
            </h5>
        </div>
    );
};

export default Summary;
