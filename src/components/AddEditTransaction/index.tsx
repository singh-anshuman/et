import { useState } from 'react';
import {
    Button,
    Col,
    FloatingLabel,
    Form,
    Row,
    Spinner,
    Toast,
    ToastContainer,
} from 'react-bootstrap';
import { Transaction } from '../Home/TransactionList/Transaction';
import {
    insertTransaction,
    updateTransaction,
} from '../../services/transactionService';
import { useReferenceData } from '../ReferenceDataProvider/ReferenceData';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTransactionById } from '../../services/transactionService';

const blankTransaction: Transaction = {
    category: '',
    split: '',
    amount: 0,
    transaction_date: new Date(),
    item_details: '',
    entry_date: new Date(),
    is_expense: true,
    nehu_owns_anshu: 0,
    is_settled: false,
};

const AddEditTransaction: React.FC<{}> = () => {
    const [transactionDetails, setTransactionDetails] =
        useState<Transaction>(blankTransaction);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [txnInProgress, setTxnInProgress] = useState<boolean>(false);
    const [loadingTxnInProgress, setLoadingTxnInProgress] =
        useState<boolean>(true);

    const { category, split } = useReferenceData();

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const txnId = searchParams.get('txn-id');
        if (txnId) {
            (async () => {
                const response = await getTransactionById(Number(txnId));
                if (response.status === 200) {
                    setTransactionDetails({
                        ...response.data,
                        transaction_date: new Date(
                            response.data.transaction_date
                        ),
                        entry_date: new Date(response.data.entry_date),
                    });
                    setLoadingTxnInProgress(false);
                } else {
                    setErrorMessage('Error fetching transaction details');
                }
            })();
        } else {
            setLoadingTxnInProgress(false);
        }
    }, [searchParams]);

    const addEditTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        setTxnInProgress(true);
        if (transactionDetails.id !== undefined) {
            const data = await updateTransaction(
                transactionDetails.id,
                transactionDetails
            );
            if (data?.status == 204) {
                setSuccessMessage(`Transaction updated successfully!`);
                setTxnInProgress(false);
            } else {
                setErrorMessage(`Error updating transaction`);
                setTxnInProgress(false);
            }
        } else {
            const data = await insertTransaction(transactionDetails);
            if (data?.status == 201) {
                setSuccessMessage(`Transaction added successfully!`);
                setTxnInProgress(false);
                setTransactionDetails(blankTransaction);
            } else {
                setErrorMessage(`Error adding transaction`);
                setTxnInProgress(false);
            }
        }
    };

    const calculateNehuOwnsAnshu = (
        amount: number | string | undefined,
        split: string
    ): number | undefined => {
        if (amount && split) {
            const amt = Number(amount);
            switch (split) {
                case 'Anshu Paid - Split Equally':
                    return amt / 2;
                case 'Anshu Paid - For Self':
                    return 0;
                case 'Anshu Paid - For Nehu':
                    return amt;
                case 'Nehu Paid - Split Equally':
                    return -amt / 2;
                case 'Nehu Paid - For Self':
                    return 0;
                case 'Nehu Paid - For Anshu':
                    return -amt;
                default:
                    return undefined;
            }
        }
        return undefined;
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, type, value } = e.target as HTMLInputElement;
        const checked =
            (e.target as HTMLInputElement).type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : undefined;
        setTransactionDetails({
            ...transactionDetails,
            [name]:
                name === 'transaction_date'
                    ? new Date(value)
                    : type === 'checkbox'
                      ? checked
                      : value,
            nehu_owns_anshu: calculateNehuOwnsAnshu(
                name == 'amount' ? value : transactionDetails.amount,
                name == 'split' ? value : transactionDetails.split
            ),
        });
    };

    return (
        <>
            {loadingTxnInProgress ? (
                <div>
                    <Spinner />
                    <div>Loading Transaction Details...</div>
                </div>
            ) : (
                <>
                    {successMessage && (
                        <ToastContainer
                            className="p-3"
                            position="top-center"
                            style={{ zIndex: 1 }}
                        >
                            <Toast
                                onClose={() => setSuccessMessage('')}
                                show={successMessage !== ''}
                                delay={3000}
                                bg={'success'}
                                autohide
                            >
                                <Toast.Body style={{ color: 'white' }}>
                                    {successMessage}
                                </Toast.Body>
                            </Toast>
                        </ToastContainer>
                    )}
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
                    <div
                        style={{
                            padding: '10px',
                            maxWidth: '500px',
                            margin: '0 auto',
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-center p-2 border rounded bg-light">
                            <div>
                                <div className="text-muted small">ID</div>
                                <div>{transactionDetails.id ?? '-'}</div>
                            </div>
                            <div className="text-end">
                                <div className="text-muted small">
                                    Entry Date
                                </div>
                                <div>
                                    {transactionDetails.entry_date.toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <Form onSubmit={addEditTransaction}>
                            <div className="d-flex justify-content-between align-items-center">
                                <FloatingLabel
                                    style={{ marginTop: '20px' }}
                                    controlId="transaction_date"
                                    label="Txn Date"
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
                                    style={{ marginTop: '20px' }}
                                    controlId="amount"
                                    label="Amount (₹)"
                                >
                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        value={transactionDetails.amount}
                                        placeholder="Enter Amount"
                                        inputMode="decimal"
                                        onChange={handleChange}
                                    />
                                </FloatingLabel>
                            </div>

                            <FloatingLabel
                                controlId="item_details"
                                label="Item Details"
                                style={{ marginTop: '20px' }}
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
                                    {category.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
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
                                    {split.map((sp) => (
                                        <option key={sp} value={sp}>
                                            {sp}
                                        </option>
                                    ))}
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
                            <div className="d-flex justify-content-between align-items-center p-2">
                                <Form.Group
                                    className="mb-3"
                                    controlId="is_expense"
                                >
                                    <Form.Check
                                        type="checkbox"
                                        name="is_expense"
                                        label="Expense"
                                        onChange={handleChange}
                                        checked={transactionDetails.is_expense}
                                    />
                                </Form.Group>
                                <div className="text-end">
                                    <Button
                                        variant="success"
                                        type="submit"
                                        disabled={txnInProgress}
                                    >
                                        {txnInProgress ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                />
                                                <span
                                                    style={{
                                                        marginLeft: '5px',
                                                    }}
                                                >
                                                    Saving...
                                                </span>
                                            </>
                                        ) : (
                                            'Save'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </>
            )}
        </>
    );
};

export default AddEditTransaction;
