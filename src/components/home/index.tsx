import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import TransactionList from './TransactionList';
import { Transaction } from './TransactionList/Transaction';
import { Spinner } from 'react-bootstrap';

const Home: React.FC<{}> = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [fetchingTransactions, setFetchingTransactions] =
        useState<boolean>(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const { data, error } = await supabase
            .from<'transactions', Transaction>('transactions')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.error('Error fetching expenses:', error);
        } else if (data) {
            setTransactions(data);
        }
        setFetchingTransactions(false);
    };

    return (
        <>
            {fetchingTransactions ? (
                <div>
                    <Spinner />
                    <div>Loading Transactions...</div>
                </div>
            ) : (
                <TransactionList transactions={transactions} />
            )}
        </>
    );
};

export default Home;
