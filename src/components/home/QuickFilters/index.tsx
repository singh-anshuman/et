import { Badge } from 'react-bootstrap';
import { Transaction } from '../TransactionList/Transaction';

const QuickFilters: React.FC<{
    transactions: Transaction[];
    filterTransactionsByMonth: Function;
    selectedFilter?: string;
}> = ({ transactions, filterTransactionsByMonth, selectedFilter }) => {
    const getMonths = (): string[] => {
        const months = transactions
            .slice() // don't mutate the original array
            .sort((a, b) => {
                const ta = new Date(a.transaction_date).getTime();
                const tb = new Date(b.transaction_date).getTime();
                return ta - tb;
            })
            .map((transaction) => {
                const date = new Date(transaction.transaction_date);
                return `${date.toLocaleString('default', { month: 'long' })}-${date.getFullYear()}`;
            });
        return Array.from(new Set(months));
    };
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center', // Added for vertical alignment
                gap: '10px',
            }}
        >
            {getMonths().map((m) => {
                return (
                    <Badge
                        bg={selectedFilter === m ? 'dark' : 'secondary'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => filterTransactionsByMonth(m)}
                        key={m}
                    >
                        {m}
                    </Badge>
                );
            })}
        </div>
    );
};

export default QuickFilters;
