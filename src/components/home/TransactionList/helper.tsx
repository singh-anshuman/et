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
            width: 110,
            headerName: 'Txn Date',
            onCellClicked: (event) => editTransaction(event),
        },
        {
            field: 'item_details',
            width: 150,
            headerName: 'Details',
            tooltipField: 'item_details',
            onCellClicked: (event) => editTransaction(event),
        },
        {
            field: 'amount',
            headerName: 'Amount',
            width: 130,
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
            width: 170,
            onCellClicked: (event) => editTransaction(event),
            cellRenderer: (params: { value: any }) => {
                return <Badge bg="secondary">{params.value}</Badge>;
            },
            tooltipField: 'split',
        },
        {
            field: 'nehu_owns_anshu',
            headerName: 'Nehu Owns Anshu',
            width: 150,
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
            width: 110,
            headerName: 'Entry Date',
            onCellClicked: (event) => editTransaction(event),
        },
        {
            field: 'is_expense',
            width: 110,
            headerName: 'Is Expense',
            onCellClicked: (event) => editTransaction(event),
        },
        {
            field: 'actions',
            width: 90,
            cellRenderer: (params: { data: any; value: any }) => {
                return (
                    <Button
                        variant="danger"
                        type="submit"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            delTxnConfirmation(params.data.id);
                        }}
                    >
                        Del
                    </Button>
                );
            },
        },
    ];
};
