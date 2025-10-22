import { Button, Card } from 'react-bootstrap';
import { Transaction } from '../../TransactionList/Transaction';

const TransactionCard: React.FC<{ transaction: Transaction }> = ({
    transaction,
}) => {
    const getAmount = () => {
        if (transaction.amount != null) {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
            }).format(transaction.amount);
        }
    };
    return (
        <div style={{ margin: '10px' }}>
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <b>#{transaction.id}</b> {transaction.item_details}
                            <div className="text-muted small">
                                Txn Date -{' '}
                                {transaction.transaction_date.toLocaleString()}
                            </div>
                        </div>
                        <div className="text-end">
                            <b>{getAmount()}</b>
                            <i
                                className="bi bi-trash"
                                style={{
                                    color: 'red',
                                    cursor: 'pointer',
                                    marginLeft: '10px',
                                }}
                                onClick={(e) => {
                                    // e.stopPropagation();
                                    // delTxnConfirmation(params.data.id);
                                }}
                            ></i>
                        </div>
                    </div>
                </Card.Header>
                {/* <Card.Body>
                    <Card.Title>{transaction.category}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        {transaction.split}
                    </Card.Subtitle>
                    <Card.Text>Amount: {transaction.amount}</Card.Text>
                </Card.Body> */}
            </Card>
        </div>
    );
};

export default TransactionCard;
