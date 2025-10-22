import { ColDef } from 'ag-grid-community';
import { Transaction } from './Transaction';
import { Badge, Button } from 'react-bootstrap';

export const getTransactionListColumns = (
    delTxnConfirmation: Function,
    editTransaction: Function
): ColDef<Transaction | any>[] => {
    return [
        {
            field: 'id',
            sort: 'desc',
            width: 80,
            headerName: 'ID',
            onCellClicked: (event) => editTransaction(event),
        },
        {
            field: 'transaction_date',
            width: 120,
            headerName: 'Txn Date',
            onCellClicked: (event) => editTransaction(event),
        },
        {
            field: 'item_details',
            width: 240,
            headerName: 'Details',
            tooltipField: 'item_details',
            onCellClicked: (event) => editTransaction(event),
        },
        {
            field: 'amount',
            headerName: 'Amount',
            width: 120,
            onCellClicked: (event) => editTransaction(event),
            valueFormatter: (params: { value: any }) => {
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
            onCellClicked: (event) => editTransaction(event),
            cellRenderer: (params: { value: any }) => {
                return <Badge bg="dark">{params.value}</Badge>;
            },
            tooltipField: 'category',
        },
        {
            field: 'split',
            width: 200,
            onCellClicked: (event) => editTransaction(event),
            cellRenderer: (params: { value: any }) => {
                return <Badge bg="secondary">{params.value}</Badge>;
            },
            tooltipField: 'split',
        },
        {
            field: 'nehu_owns_anshu',
            headerName: 'Nehu Owns Anshu',
            width: 160,
            onCellClicked: (event) => editTransaction(event),
            cellRenderer: (params: { value: any }) => {
                if (params.value != null) {
                    return (
                        <span
                            style={{
                                display: 'flex',
                                justifyContent: 'end',
                                color:
                                    params.value > 0
                                        ? 'green'
                                        : params.value < 0
                                          ? 'red'
                                          : 'blue',
                            }}
                        >
                            {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                            }).format(params.value)}
                        </span>
                    );
                }
                return params.value;
            },
        },
        {
            field: 'entry_date',
            width: 120,
            headerName: 'Entry Date',
            onCellClicked: (event) => editTransaction(event),
        },
        {
            field: 'is_expense',
            width: 100,
            headerName: 'Expense',
            onCellClicked: (event) => editTransaction(event),
            cellRenderer: (params: { value: any }) => {
                return params.value ? (
                    <span style={{ display: 'flex', justifyContent: 'center' }}>
                        ✔
                    </span>
                ) : null;
            },
        },
        {
            field: '',
            width: 50,
            cellRenderer: (params: { data: any; value: any }) => {
                return (
                    <i
                        className="bi bi-trash"
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            delTxnConfirmation(params.data.id);
                        }}
                    ></i>
                );
            },
        },
    ];
};
