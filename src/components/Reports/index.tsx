import { useEffect, useMemo, useState } from 'react';
import { Alert, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { getAllTransactions } from '../../services/transactionService';
import { Transaction } from '../Home/TransactionList/Transaction';

type MonthlyExpense = {
    month: string;
    label: string;
};

type CategoryExpense = {
    category: string;
    transactionCount: number;
    total: number;
};

const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});

const getMonthKey = (date: Date): string =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const formatMonth = (date: Date): string =>
    date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

const Reports: React.FC<{}> = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const { data, error } = await getAllTransactions();
                if (error) {
                    setErrorMessage('Unable to fetch transactions for report.');
                    return;
                }
                setTransactions(data ?? []);
            } catch {
                setErrorMessage('Unable to fetch transactions for report.');
            } finally {
                setIsLoading(false);
            }
        };

        void fetchTransactions();
    }, []);

    const months = useMemo(() => {
        const monthsByKey = new Map<string, MonthlyExpense>();

        transactions.forEach((transaction) => {
            const date = new Date(transaction.transaction_date);
            if (Number.isNaN(date.getTime())) {
                return;
            }

            const month = getMonthKey(date);
            if (!monthsByKey.has(month)) {
                monthsByKey.set(month, { month, label: formatMonth(date) });
            }
        });

        return Array.from(monthsByKey.values()).sort((a, b) =>
            b.month.localeCompare(a.month)
        );
    }, [transactions]);

    const activeMonth = months.some(({ month }) => month === selectedMonth)
        ? selectedMonth
        : (months[0]?.month ?? '');

    const categoryExpenses = useMemo(() => {
        const expensesByCategory = new Map<string, CategoryExpense>();

        transactions.forEach((transaction) => {
            const date = new Date(transaction.transaction_date);
            if (
                !transaction.is_expense ||
                Number.isNaN(date.getTime()) ||
                getMonthKey(date) !== activeMonth
            ) {
                return;
            }

            const category = transaction.category.trim() || 'Uncategorized';
            const amount = Number(transaction.amount ?? 0);
            const existing = expensesByCategory.get(category);

            if (existing) {
                existing.transactionCount += 1;
                existing.total += Number.isFinite(amount) ? amount : 0;
            } else {
                expensesByCategory.set(category, {
                    category,
                    transactionCount: 1,
                    total: Number.isFinite(amount) ? amount : 0,
                });
            }
        });

        return Array.from(expensesByCategory.values()).sort(
            (a, b) => b.total - a.total
        );
    }, [activeMonth, transactions]);

    const totalExpenses = categoryExpenses.reduce(
        (total, category) => total + category.total,
        0
    );

    return (
        <div style={{ padding: '20px' }}>
            <h4>Monthly Expenses</h4>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {isLoading ? (
                <div style={{ textAlign: 'center', marginTop: '100px' }}>
                    <Spinner />
                    <div>Loading expense report...</div>
                </div>
            ) : (
                <>
                    {!errorMessage && months.length > 0 && (
                        <Row className="align-items-end mb-3">
                            <Col md={4}>
                                <Form.Group controlId="report-month">
                                    <Form.Select
                                        value={activeMonth}
                                        onChange={(event) =>
                                            setSelectedMonth(event.target.value)
                                        }
                                    >
                                        {months.map(({ month, label }) => (
                                            <option key={month} value={month}>
                                                {label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <div
                                    style={{
                                        border: '1px solid lightgrey',
                                        borderRadius: '5px',
                                        marginTop: '10px',
                                        padding: '6px 15px',
                                    }}
                                >
                                    <strong>Total expenses: </strong>
                                    {currencyFormatter.format(totalExpenses)}
                                </div>
                            </Col>
                        </Row>
                    )}
                    {categoryExpenses.length > 0 ? (
                        <div style={{ marginTop: '50px' }}>
                            <h5>Expenses by category</h5>
                            <Row style={{ marginTop: '30px' }}>
                                <Col md={8}>
                                    <div
                                        role="img"
                                        aria-label="Bar chart of expense amount by category"
                                        style={{
                                            width: '100%',
                                            height: 550,
                                        }}
                                    >
                                        <ResponsiveContainer>
                                            <BarChart
                                                data={categoryExpenses}
                                                margin={{
                                                    top: 16,
                                                    right: 24,
                                                    left: 24,
                                                    bottom: 24,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="category"
                                                    interval={0}
                                                    angle={-55}
                                                    textAnchor="end"
                                                    height={200}
                                                />
                                                <YAxis
                                                    tickFormatter={(
                                                        value: number
                                                    ) =>
                                                        value.toLocaleString(
                                                            'en-IN'
                                                        )
                                                    }
                                                />
                                                <Tooltip
                                                    formatter={(value) =>
                                                        currencyFormatter.format(
                                                            Number(value ?? 0)
                                                        )
                                                    }
                                                />
                                                <Bar
                                                    dataKey="total"
                                                    name="Total expenses"
                                                    fill="#333d3e"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Category</th>
                                                <th>Number of transactions</th>
                                                <th>Total amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categoryExpenses.map(
                                                (category) => (
                                                    <tr key={category.category}>
                                                        <td>
                                                            {category.category}
                                                        </td>
                                                        <td>
                                                            {
                                                                category.transactionCount
                                                            }
                                                        </td>
                                                        <td>
                                                            {currencyFormatter.format(
                                                                category.total
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </div>
                    ) : (
                        !errorMessage && (
                            <p>
                                {months.length === 0
                                    ? 'No transactions found.'
                                    : 'No expense transactions found for this month.'}
                            </p>
                        )
                    )}
                </>
            )}
        </div>
    );
};

export default Reports;
