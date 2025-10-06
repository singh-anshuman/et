import { useCallback, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi } from 'ag-grid-community';
import { Transaction } from './Transaction';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Badge } from 'react-bootstrap';

ModuleRegistry.registerModules([AllCommunityModule]);

const TransactionList: React.FC<{ transactions: Transaction[] }> = ({
    transactions,
}) => {
    const [rowData] = useState<Transaction[]>(transactions);
    const gridApi = useRef<GridApi | null>(null);

    const [colDefs] = useState<ColDef<Transaction | any>[]>([
        { field: 'id', sort: 'desc', width: 80 },
        { field: 'transaction_date', width: 140 },
        { field: 'item_details', width: 230 },
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
            width: 180,
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
            width: 110,
            cellRenderer: (params: { value: any }) => {
                return <p>Delete</p>;
            },
        },
    ]);

    const onGridReady = useCallback((params: { api: GridApi }) => {
        gridApi.current = params.api;
    }, []);

    return (
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
    );
};

export default TransactionList;
