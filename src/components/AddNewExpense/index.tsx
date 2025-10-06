import { useState } from 'react';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Transaction } from '../Home/TransactionList/Transaction';
import { insertTransaction } from '../../services/transactionService';

const AddNewExpense: React.FC<{}> = () => {
    const [transactionDetails, setTransactionDetails] = useState<Transaction>({
        category: '',
        split: '',
        transaction_date: new Date(),
        item_details: '',
        entry_date: new Date(),
        is_expense: true,
    });

    const addTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data, error } = await insertTransaction(transactionDetails);
        if (error) {
            console.error('Error inserting transactions:', error);
        } else if (data) {
            console.log('Transaction inserted successfully:', data);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setTransactionDetails({
            ...transactionDetails,
            [name]: value,
            nehu_owns_anshu: 1000,
        });
    };
    return (
        <div style={{ padding: '10px', maxWidth: '500px', margin: '0 auto' }}>
            <Form onSubmit={addTransaction}>
                <FloatingLabel
                    style={{ marginTop: '10px' }}
                    controlId="tranaction_id"
                    label="ID"
                    className="mb-3"
                >
                    <Form.Control
                        type="number"
                        value={transactionDetails.id}
                        readOnly
                    />
                </FloatingLabel>
                <FloatingLabel
                    style={{ marginTop: '10px' }}
                    controlId="transaction_date"
                    label="Transaction Date"
                    className="mb-3"
                >
                    <Form.Control
                        type="date"
                        name="transaction_date"
                        placeholder="Enter transaction date"
                        value={
                            transactionDetails.transaction_date
                                .toISOString()
                                .split('T')[0]
                        }
                        onChange={handleChange}
                    />
                </FloatingLabel>
                <FloatingLabel
                    controlId="item_details"
                    label="Item Details"
                    style={{ marginTop: '10px' }}
                    className="mb-3"
                >
                    <Form.Control
                        type="text"
                        name="item_details"
                        placeholder="Enter Item Details"
                        value={transactionDetails.item_details}
                        onChange={handleChange}
                    />
                </FloatingLabel>
                <FloatingLabel
                    style={{ marginTop: '10px' }}
                    controlId="amount"
                    label="Amount (₹)"
                    className="mb-3"
                >
                    <Form.Control
                        type="number"
                        name="amount"
                        value={transactionDetails.amount}
                        placeholder="Enter Amount"
                        onChange={handleChange}
                    />
                </FloatingLabel>
                <FloatingLabel
                    controlId="cateogry"
                    label="Category"
                    style={{ marginTop: '10px' }}
                    className="mb-3"
                >
                    <Form.Select
                        name="category"
                        value={transactionDetails.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select category</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                    </Form.Select>
                </FloatingLabel>
                <FloatingLabel
                    controlId="cateogry"
                    label="Category"
                    style={{ marginTop: '10px' }}
                    className="mb-3"
                >
                    <Form.Select
                        name="split"
                        value={transactionDetails.split}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Split</option>
                        <option value="anshu_paid_split_equally">
                            Anshu Paid - Split Equally
                        </option>
                        <option value="nehu_paid_split_equally">
                            Nehu Paid - Split Equally
                        </option>
                    </Form.Select>
                </FloatingLabel>
                <FloatingLabel
                    style={{ marginTop: '10px' }}
                    controlId="nehu_owns_anshu"
                    label="Nehu Owns Anshu (₹)"
                    className="mb-3"
                >
                    <Form.Control
                        type="number"
                        name="nehu_owns_anshu"
                        onChange={handleChange}
                        value={transactionDetails.nehu_owns_anshu}
                        readOnly
                    />
                </FloatingLabel>
                <Form.Group className="mb-3" controlId="is_expense">
                    <Form.Check
                        type="checkbox"
                        name="is_expense"
                        label="Expense"
                        onChange={handleChange}
                        value={transactionDetails.is_expense ? 'true' : 'false'}
                    />
                </Form.Group>
                <div style={{ textAlign: 'right' }}>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default AddNewExpense;
