import { Button, Modal } from 'react-bootstrap';

const DeletionConfirmation: React.FC<{
    delTxn: Function;
    txnId: string;
    showDelConfirmation: boolean;
    hideDelConfirmation: Function;
}> = ({ delTxn, txnId, showDelConfirmation, hideDelConfirmation }) => {
    return (
        <Modal
            show={showDelConfirmation}
            onHide={() => hideDelConfirmation()}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Deletion Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Are you sure you want to delete transaction with id:{' '}
                    <b>{txnId}</b>?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => hideDelConfirmation()}
                >
                    Cancel
                </Button>
                <Button variant="danger" onClick={() => delTxn(txnId)}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeletionConfirmation;
