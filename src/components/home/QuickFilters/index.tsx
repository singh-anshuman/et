import { Badge } from 'react-bootstrap';
import { Transaction } from '../TransactionList/Transaction';

const QuickFilters: React.FC<{
    transactions: Transaction[];
    filterTransactionsByMonth: Function;
}> = ({ transactions, filterTransactionsByMonth }) => {
    const getMonths = (): string[] => {
        const months = transactions.map((transaction) => {
            const date = new Date(transaction.transaction_date);
            return `${date.toLocaleString('default', { month: 'long' })}-${date.getFullYear()}`;
        });
        return Array.from(new Set(months));
    };
    return (
        <div>
            {getMonths().map((m) => {
                return (
                    <Badge
                        bg="dark"
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
