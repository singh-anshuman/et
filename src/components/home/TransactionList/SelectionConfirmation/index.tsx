import { Button, Modal } from 'react-bootstrap';
import { Transaction } from '../Transaction';

const SelectionConfirmation: React.FC<{
    settleTransactions: Function;
    showSettlementConfirmation: boolean;
    hideSettlementConfirmation: Function;
}> = ({
    settleTransactions,
    showSettlementConfirmation: showSelectionConfirmation,
    hideSettlementConfirmation: hideSelectionConfirmation,
}) => {
    return (
        <Modal
            show={showSelectionConfirmation}
            onHide={() => hideSelectionConfirmation()}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Settlement Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Are you sure you want to mark the selected transactions as
                    settled ?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => hideSelectionConfirmation()}
                >
                    Cancel
                </Button>
                <Button variant="success" onClick={() => settleTransactions()}>
                    Mark as Settled
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SelectionConfirmation;
