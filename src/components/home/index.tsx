import { useEffect, useState } from 'react';
import TransactionList from './TransactionList';
import { Transaction } from './TransactionList/Transaction';
import {
    Col,
    Row,
    Spinner,
    Tab,
    Tabs,
    Toast,
    ToastContainer,
} from 'react-bootstrap';
import { getAllTransactions } from '../../services/transactionService';
import Summary from './Summary';
import QuickFilters from './QuickFilters';
import TransactionCards from './TransactionCards';

const Home: React.FC<{}> = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [fetchingTransactions, setFetchingTransactions] =
        useState<boolean>(true);
    const [selectedFilter, setSelectedFilter] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [selectedTab, setSelectedTab] = useState<string>('table');

    useEffect(() => {
        fetchTransactions();
        const mq: any = window.matchMedia('(max-width: 767px)');
        const updateTab = (e?: any) =>
            setSelectedTab((e ? e.matches : mq.matches) ? 'card' : 'table');
        updateTab();
        if (mq.addEventListener) mq.addEventListener('change', updateTab);
        else mq.addListener(updateTab);
        return () => {
            if (mq.removeEventListener)
                mq.removeEventListener('change', updateTab);
            else mq.removeListener(updateTab);
        };
    }, []);

    const fetchTransactions = async () => {
        const { data, error } = await getAllTransactions();
        if (error) {
            setErrorMessage(`Error fetching transactions`);
        } else if (data) {
            setTransactions(data);
            setAllTransactions(data);
        }
        setFetchingTransactions(false);
    };

    const filterTransactionsByMonth = (month: string) => {
        if (month === selectedFilter) {
            setSelectedFilter('');
            setTransactions(allTransactions);
        } else {
            setSelectedFilter(month);
            const [filterMonth, filterYear] = month.split('-');
            const filtered = allTransactions.filter((transaction) => {
                const txn_date = new Date(transaction.transaction_date);
                return (
                    txn_date.getMonth() ===
                        new Date(
                            `${filterMonth} 1, ${filterYear}`
                        ).getMonth() &&
                    txn_date.getFullYear() === parseInt(filterYear, 10)
                );
            });
            setTransactions(filtered);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            {errorMessage && (
                <ToastContainer
                    className="p-3"
                    position="top-center"
                    style={{ zIndex: 1 }}
                >
                    <Toast
                        onClose={() => setErrorMessage('')}
                        show={errorMessage !== ''}
                        delay={3000}
                        bg={'danger'}
                        autohide
                    >
                        <Toast.Body style={{ color: 'white' }}>
                            {errorMessage}
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
            )}
            {fetchingTransactions ? (
                <div style={{ textAlign: 'center', marginTop: '200px' }}>
                    <Spinner />
                    <div>Loading Transactions...</div>
                </div>
            ) : (
                <>
                    <div style={{ marginTop: '20px' }}>
                        <Row>
                            <Col md={8}>
                                <QuickFilters
                                    transactions={allTransactions}
                                    filterTransactionsByMonth={
                                        filterTransactionsByMonth
                                    }
                                    selectedFilter={selectedFilter}
                                />
                            </Col>
                            <Col md={4}>
                                <Summary transactions={transactions} />
                            </Col>
                        </Row>
                    </div>
                    <Tabs
                        defaultActiveKey={selectedTab}
                        id="transaction-list-tabs"
                        style={{ marginTop: '20px' }}
                    >
                        <Tab eventKey="table" title="Table View">
                            <TransactionList transactions={transactions} />
                        </Tab>
                        <Tab eventKey="card" title="Card View">
                            <TransactionCards transactions={transactions} />
                        </Tab>
                    </Tabs>
                </>
            )}
        </div>
    );
};

export default Home;
