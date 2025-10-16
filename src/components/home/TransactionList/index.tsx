import { useCallback, useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    CellClickedEvent,
    ColDef,
    Column,
    GridApi,
    RowClickedEvent,
} from 'ag-grid-community';
import { Transaction } from './Transaction';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Toast, ToastContainer } from 'react-bootstrap';
import { deleteTransaction } from '../../../services/transactionService';
import { getTransactionListColumns } from './helper';
import DeletionConfirmation from './DeletionConfirmation';

ModuleRegistry.registerModules([AllCommunityModule]);

const TransactionList: React.FC<{ transactions: Transaction[] }> = ({
    transactions,
}) => {
    const [rowData, setRowData] = useState<Transaction[]>(transactions);
    const gridApi = useRef<GridApi | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [colDefs, setColDefs] = useState<ColDef<Transaction | any>[]>();
    const [delTxnId, setDelTxnId] = useState<string>('');
    const [showDelConfirmation, setShowDelConfirmation] =
        useState<boolean>(false);

    useEffect(() => {
        setColDefs(
            getTransactionListColumns(delTxnConfirmation, editTransaction)
        );
    }, []);

    useEffect(() => {
        setRowData(transactions);
    }, [transactions]);

    const onGridReady = useCallback((params: { api: GridApi }) => {
        gridApi.current = params.api;
    }, []);

    const hideDelConfirmation = () => {
        setShowDelConfirmation(false);
        setDelTxnId('');
    };

    const delTxnConfirmation = (id: string) => {
        setDelTxnId(id);
        setShowDelConfirmation(true);
    };

    const delTxn = async (id: number) => {
        const data = await deleteTransaction(id);
        if (data?.status == 204) {
            setSuccessMessage(`Transaction deleted successfully!`);
            setShowDelConfirmation(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            setErrorMessage(`Error deleting transaction`);
        }
        setDelTxnId('');
    };

    const editTransaction = useCallback(
        (event: CellClickedEvent<Transaction>) => {
            window.location.assign(
                `${window.location.origin}/#add-edit-transaction?txn-id=${event.data?.id}`
            );
        },
        []
    );

    return (
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
            {showDelConfirmation && (
                <DeletionConfirmation
                    delTxn={delTxn}
                    txnId={delTxnId}
                    showDelConfirmation={showDelConfirmation}
                    hideDelConfirmation={hideDelConfirmation}
                />
            )}
            <div
                className="ag-theme-alpine"
                style={{
                    height: '600px',
                    marginTop: '20px',
                }}
            >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationPageSize={20}
                    onGridReady={onGridReady}
                    getRowStyle={() => ({ cursor: 'pointer' })}
                />
            </div>
        </>
    );
};

export default TransactionList;
