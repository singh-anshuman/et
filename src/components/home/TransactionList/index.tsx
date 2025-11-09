import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    CellClickedEvent,
    ColDef,
    Column,
    GridApi,
    RowClickedEvent,
    SelectionChangedEvent,
} from 'ag-grid-community';
import { Transaction } from './Transaction';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Button, Toast, ToastContainer } from 'react-bootstrap';
import {
    deleteTransaction,
    markTransactionsAsSettled,
} from '../../../services/transactionService';
import { getTransactionListColumns } from './helper';
import DeletionConfirmation from './DeletionConfirmation';
import SelectionConfirmation from './SelectionConfirmation';

ModuleRegistry.registerModules([AllCommunityModule]);

const TransactionList: React.FC<{
    transactions: Transaction[];
    quickFilterText: string;
}> = ({ transactions, quickFilterText }) => {
    const [rowData, setRowData] = useState<Transaction[]>(transactions);
    const gridApi = useRef<GridApi | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [colDefs, setColDefs] = useState<ColDef<Transaction | any>[]>();
    const [delTxnId, setDelTxnId] = useState<string>('');
    const [showDelConfirmation, setShowDelConfirmation] =
        useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<Transaction[]>([]);
    const [showSettlementConfirmation, setShowSettlementConfirmation] =
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

    const hideSettlementConfirmation = () => {
        setShowSettlementConfirmation(false);
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
                `${window.location.origin}/et#add-edit-transaction?txn-id=${event.data?.id}`
            );
        },
        []
    );

    const onSelectionChanged = useCallback(
        (event: SelectionChangedEvent<Transaction>) => {
            const selectedNodes = event.api.getSelectedNodes();
            setSelectedRows(
                selectedNodes.length > 0
                    ? selectedNodes
                          .map((node) => node.data)
                          .filter(
                              (data): data is Transaction => data !== undefined
                          )
                    : []
            );
        },
        []
    );

    const settleTransactions = () => {
        markTransactionsAsSettled(selectedRows.map((txn) => txn.id!)).then(
            (data) => {
                setShowSettlementConfirmation(false);
                if (data?.status == 204) {
                    setSuccessMessage(
                        `Selected transactions marked as settled!`
                    );
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    setErrorMessage(`Error marking transactions as settled`);
                }
            }
        );
    };
    const paginationPageSizeSelector = useMemo(() => {
        return [20, 50, 100, 200, 500, 1000];
    }, []);

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
            {showSettlementConfirmation && (
                <SelectionConfirmation
                    settleTransactions={settleTransactions}
                    showSettlementConfirmation={showSettlementConfirmation}
                    hideSettlementConfirmation={hideSettlementConfirmation}
                />
            )}
            {selectedRows.length > 0 && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'end',
                        margin: '20px 0 10px 0',
                    }}
                >
                    <Button
                        variant="success"
                        type="submit"
                        onClick={() => setShowSettlementConfirmation(true)}
                    >
                        Mark as Settled
                    </Button>
                </div>
            )}
            <div
                className="ag-theme-alpine"
                style={{
                    height: '500px',
                    marginTop: '20px',
                }}
            >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationPageSize={100}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    onGridReady={onGridReady}
                    rowSelection={{
                        mode: 'multiRow',
                        headerCheckbox: true,
                        isRowSelectable: (node) =>
                            !node.data?.is_settled && !node.data?.to_be_updated,
                    }}
                    getRowStyle={(params) => ({
                        cursor: 'pointer',
                        backgroundColor: params.data?.is_settled
                            ? '#e8feedff'
                            : params.data?.to_be_updated
                              ? '#fff4e6ff'
                              : '#FFFFFF',
                    })}
                    onSelectionChanged={onSelectionChanged}
                    quickFilterText={quickFilterText}
                />
            </div>
        </>
    );
};

export default TransactionList;
