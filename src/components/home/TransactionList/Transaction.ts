export type Transaction = {
    id?: number;
    transaction_date: Date;
    item_details: string;
    amount?: number;
    category: string;
    split: string;
    nehu_owns_anshu?: number;
    entry_date: Date;
    is_expense: boolean;
    is_settled: boolean;
};
