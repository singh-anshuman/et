export type Transaction = {
    id: number;
    category: string;
    amount: number;
    split: string;
    transaction_date: Date;
    nehu_owns_anshu: string;
    item_details: string;
    is_expense: boolean;
};
