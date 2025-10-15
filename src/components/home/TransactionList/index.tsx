import { useCallback, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi } from 'ag-grid-community';
import { Transaction } from './Transaction';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Badge, Button, Toast, ToastContainer } from 'react-bootstrap';
import { deleteTransaction } from '../../../services/transactionService';

ModuleRegistry.registerModules([AllCommunityModule]);

const TransactionList: React.FC<{ transactions: Transaction[] }> = ({
    transactions,
}) => {
    const [rowData, setRowData] = useState<Transaction[]>(transactions);
    const gridApi = useRef<GridApi | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [colDefs] = useState<ColDef<Transaction | any>[]>([
        { field: 'id', sort: 'desc', width: 80, headerName: 'ID' },
        { field: 'transaction_date', width: 110, headerName: 'Txn Date' },
        {
            field: 'item_details',
            width: 150,
            headerName: 'Details',
            tooltipField: 'item_details',
        },
        {
            field: 'amount',
            headerName: 'Amount',
            width: 130,
            valueFormatter: (params) => {
                if (params.value != null) {
                    return new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                    }).format(params.value);
                }
                return params.value;
            },
        },
        {
            field: 'category',
            width: 180,
            cellRenderer: (params: { value: any }) => {
                return <Badge bg="dark">{params.value}</Badge>;
            },
            tooltipField: 'category',
        },
        {
            field: 'split',
            width: 170,
            cellRenderer: (params: { value: any }) => {
                return <Badge bg="secondary">{params.value}</Badge>;
            },
            tooltipField: 'split',
        },
        {
            field: 'nehu_owns_anshu',
            headerName: 'Nehu Owns Anshu',
            width: 150,
            valueFormatter: (params) => {
                if (params.value != null) {
                    return new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                    }).format(params.value);
                }
                return params.value;
            },
        },
        { field: 'entry_date', width: 110, headerName: 'Entry Date' },
        { field: 'is_expense', width: 110, headerName: 'Is Expense' },
        {
            field: 'actions',
            width: 90,
            cellRenderer: (params: { data: any; value: any }) => {
                return (
                    <Button
                        variant="danger"
                        type="submit"
                        size="sm"
                        onClick={() => delTxn(params.data.id)}
                    >
                        Del
                    </Button>
                );
            },
        },
    ]);

    const onGridReady = useCallback((params: { api: GridApi }) => {
        gridApi.current = params.api;
    }, []);

    const delTxn = async (id: number) => {
        console.log(`Delete transaction with id: ${id}`);
        const data = await deleteTransaction(id);
        if (data?.status == 204) {
            setSuccessMessage(`Transaction deleted successfully!`);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            setErrorMessage(`Error deleting transaction`);
        }
    };

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
                />
            </div>
        </>
    );
};

export default TransactionList;
