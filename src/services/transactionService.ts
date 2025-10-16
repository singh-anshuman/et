import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Transaction } from '../components/Home/TransactionList/Transaction';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase: SupabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

export const getAllTransactions = async (): Promise<{
    data: Transaction[] | null;
    error: any;
}> => {
    return await supabase
        .from<'transactions', Transaction>('transactions')
        .select('*')
        .order('id', { ascending: false });
};

export const getTransactionById = async (
    txnId: number
): Promise<{ status: number; data: any }> => {
    return await supabase
        .from('transactions')
        .select('*')
        .eq('id', txnId)
        .single();
};

export const insertTransaction = async (
    transaction: Transaction
): Promise<{ status: number }> => {
    return await supabase.from('transactions').insert([transaction]);
};

export const updateTransaction = async (
    id: number,
    updatedTransaction: Partial<Transaction>
): Promise<{ status: number }> => {
    const partialTransaction: Partial<Transaction> = { ...updatedTransaction };
    return await supabase
        .from('transactions')
        .update(partialTransaction)
        .eq('id', id);
};

export const deleteTransaction = async (
    id: number
): Promise<{ status: number }> => {
    return await supabase.from('transactions').delete().eq('id', id);
};
