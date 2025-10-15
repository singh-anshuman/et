import { useEffect, useState } from 'react';
import TransactionList from './TransactionList';
import { Transaction } from './TransactionList/Transaction';
import { Spinner } from 'react-bootstrap';
import { getAllTransactions } from '../../services/transactionService';
import Summary from './Summary';
import QuickFilters from './QuickFilters';

const Home: React.FC<{}> = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [fetchingTransactions, setFetchingTransactions] =
        useState<boolean>(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const { data, error } = await getAllTransactions();
        if (error) {
            console.error('Error fetching expenses:', error);
        } else if (data) {
            setTransactions(data);
        }
        setFetchingTransactions(false);
    };

    const filterTransactionsByMonth = (month: string) => {
        const [filterMonth, filterYear] = month.split(' ');
        const filtered = transactions.filter((transaction) => {
            const txn_date = new Date(transaction.transaction_date);
            return (
                txn_date.getMonth() ===
                    new Date(`${filterMonth} 1, ${filterYear}`).getMonth() &&
                txn_date.getFullYear() === parseInt(filterYear, 10)
            );
        });
        setTransactions(filtered);
    };

    return (
        <>
            {fetchingTransactions ? (
                <div>
                    <Spinner />
                    <div>Loading Transactions...</div>
                </div>
            ) : (
                <>
                    <Summary transactions={transactions} />
                    <QuickFilters
                        transactions={transactions}
                        filterTransactionsByMonth={filterTransactionsByMonth}
                    />
                    <TransactionList transactions={transactions} />
                </>
            )}
        </>
    );
};

export default Home;
