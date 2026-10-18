import { Badge, Button, Dropdown } from 'react-bootstrap';
import { Transaction } from '../TransactionList/Transaction';

const QuickFilters: React.FC<{
    transactions: Transaction[];
    filterTransactionsByMonth: (month: string) => void;
    selectedFilter?: string;
}> = ({ transactions, filterTransactionsByMonth, selectedFilter }) => {
    const getMonths = (): string[] => {
        const months = transactions
            .slice() // don't mutate the original array
            .sort((a, b) => {
                const ta = new Date(a.transaction_date).getTime();
                const tb = new Date(b.transaction_date).getTime();
                return tb - ta;
            })
            .map((transaction) => {
                const date = new Date(transaction.transaction_date);
                return `${date.toLocaleString('default', { month: 'long' })}-${date.getFullYear()}`;
            });
        return Array.from(new Set(months));
    };

    const isMonthSettled = (month: string): boolean => {
        return transactions.every((transaction: Transaction) => {
            const date = new Date(transaction.transaction_date);
            const transactionMonth = `${date.toLocaleString('default', { month: 'long' })}-${date.getFullYear()}`;
            return transactionMonth !== month || transaction.is_settled;
        });
    };
    const isMonthPartiallySettled = (month: string): boolean => {
        return transactions.every((transaction: Transaction) => {
            const date = new Date(transaction.transaction_date);
            const transactionMonth = `${date.toLocaleString('default', { month: 'long' })}-${date.getFullYear()}`;
            return (
                transactionMonth !== month ||
                transaction.is_settled ||
                transaction.to_be_updated
            );
        });
    };

    const getMonthStatus = (
        month: string
    ): { color: 'success' | 'warning' | 'secondary'; label: string } => {
        if (isMonthSettled(month)) {
            return { color: 'success', label: 'Settled' };
        }
        if (isMonthPartiallySettled(month)) {
            return { color: 'warning', label: 'Partially settled' };
        }
        return { color: 'secondary', label: 'Unsettled' };
    };

    return (
        <div className="d-flex align-items-center gap-2">
            <Dropdown>
                <Dropdown.Toggle
                    variant="outline-secondary"
                    id="month-filter"
                    style={{ fontFamily: 'inherit' }}
                >
                    {selectedFilter || 'Filter by month'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {getMonths().map((m) => {
                        const status = getMonthStatus(m);
                        return (
                            <Dropdown.Item
                                active={selectedFilter === m}
                                onClick={() => filterTransactionsByMonth(m)}
                                style={{ fontFamily: 'inherit' }}
                                key={m}
                            >
                                <span>{m}</span>
                                <Badge bg={status.color} className="ms-2">
                                    {status.label}
                                </Badge>
                            </Dropdown.Item>
                        );
                    })}
                </Dropdown.Menu>
            </Dropdown>
            <Button
                variant="outline-secondary"
                style={{ fontFamily: 'inherit' }}
                onClick={() =>
                    selectedFilter &&
                    filterTransactionsByMonth(selectedFilter)
                }
                disabled={!selectedFilter}
            >
                Clear filter
            </Button>
        </div>
    );
};

export default QuickFilters;
