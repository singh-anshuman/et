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
    const [rowData] = useState<Transaction[]>(transactions);
    const gridApi = useRef<GridApi | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('Hey');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [colDefs] = useState<ColDef<Transaction | any>[]>([
        { field: 'id', sort: 'desc', width: 80 },
        { field: 'transaction_date', width: 140 },
        { field: 'item_details', width: 150 },
        {
            field: 'amount',
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
            width: 150,
            cellRenderer: (params: { value: any }) => {
                return <Badge bg="dark">{params.value}</Badge>;
            },
        },
        {
            field: 'split',
            width: 170,
            cellRenderer: (params: { value: any }) => {
                return <Badge bg="secondary">{params.value}</Badge>;
            },
        },
        {
            field: 'nehu_owns_anshu',
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
        { field: 'entry_date', width: 110 },
        { field: 'is_expense', width: 110 },
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
        const { data, error } = await deleteTransaction(id);
        if (error) {
            console.error('Error inserting transactions:', error);
            setErrorMessage(
                `Error deleting transaction Transaction with ID ${id}: ${error.message}`
            );
        } else if (data) {
            console.log('Transaction inserted successfully:', data);
            setSuccessMessage(
                `Transaction with ID ${id} deleted successfully!`
            );
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
                        {/* <Toast.Header>
                            <strong className="me-auto">Bootstrap</strong>
                            <small>11 mins ago</small>
                        </Toast.Header> */}
                        <Toast.Body>{successMessage}</Toast.Body>
                    </Toast>
                </ToastContainer>
            )}
            {errorMessage && (
                <Toast
                    onClose={() => setErrorMessage('')}
                    show={errorMessage !== ''}
                    delay={3000}
                    bg={'danger'}
                    autohide
                >
                    <Toast.Header>
                        <strong>Bootstrap</strong>
                        <small>11 mins ago</small>
                    </Toast.Header>
                    <Toast.Body>{errorMessage}</Toast.Body>
                </Toast>
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
