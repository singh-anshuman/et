import { fireEvent, render, screen, within } from '@testing-library/react';
import Reports from './index';
import { getAllTransactions } from '../../services/transactionService';
import { Transaction } from '../Home/TransactionList/Transaction';

jest.mock('../../services/transactionService', () => ({
    getAllTransactions: jest.fn(),
}));

const createTransaction = (
    transactionDate: string,
    amount: number,
    category: string,
    isExpense = true
): Transaction => ({
    transaction_date: new Date(transactionDate),
    amount,
    category,
    split: 'Anshu Paid - Split Equally',
    item_details: 'Test transaction',
    entry_date: new Date(transactionDate),
    is_expense: isExpense,
    is_settled: false,
    to_be_updated: false,
});

describe('Reports', () => {
    it('defaults to the latest transaction month and groups expenses by category', async () => {
        jest.mocked(getAllTransactions).mockResolvedValue({
            data: [
                createTransaction('2025-01-12T12:00:00', 100, 'Food'),
                createTransaction('2025-01-20T12:00:00', 250, 'Food'),
                createTransaction('2025-01-25T12:00:00', 500, 'Rent', false),
                createTransaction('2025-02-02T12:00:00', 75, 'Food'),
                createTransaction('2025-02-04T12:00:00', 200, 'Transport'),
            ],
            error: null,
        });

        render(<Reports />);

        const monthFilter = await screen.findByLabelText('Report month');
        expect(monthFilter).toHaveValue('2025-02');
        expect(screen.getByText('₹275.00')).toBeInTheDocument();
        expect(screen.getByText('Food')).toBeInTheDocument();
        expect(screen.getByText('Transport')).toBeInTheDocument();

        fireEvent.change(monthFilter, { target: { value: '2025-01' } });

        const foodRow = screen.getByRole('row', { name: /food 2 ₹350.00/i });
        expect(within(foodRow).getByText('2')).toBeInTheDocument();
        expect(within(foodRow).getByText('₹350.00')).toBeInTheDocument();
        expect(
            screen.getByRole('img', {
                name: 'Bar chart of expense amount by category',
            })
        ).toBeInTheDocument();
        expect(screen.getAllByText('₹350.00')).toHaveLength(2);
        expect(screen.queryByText('Rent')).not.toBeInTheDocument();
    });
});
