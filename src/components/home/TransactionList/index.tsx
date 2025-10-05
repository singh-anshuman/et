import { useCallback, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi } from 'ag-grid-community';
import { Transaction } from './Transaction';
// import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const TransactionList: React.FC<{ transactions: Transaction[] }> = ({
    transactions,
}) => {
    const [rowData] = useState<Transaction[]>(transactions);
    const gridApi = useRef<GridApi | null>(null);

    const [colDefs] = useState<ColDef<Transaction>[]>([
        { field: 'id' },
        { field: 'category' },
        { field: 'amount' },
        { field: 'split' },
        { field: 'transaction_date' },
        { field: 'nehu_owns_anshu' },
        { field: 'item_details' },
        { field: 'is_expense' },
    ]);

    const defaultColDef: ColDef = {
        flex: 1,
    };

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
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={20}
                onGridReady={onGridReady}
            />
        </div>
    );
};

export default TransactionList;
