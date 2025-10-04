import { useEffect, useState } from 'react';
import { Transaction, supabase } from '../../supabaseClient';

const AddNewExpense: React.FC<{}> = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from<'transactions', Transaction>('transactions')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
    } else if (data) {
      setTransactions(data);
    }
  };
  return (
    <div>
      <h1>Household Expenses</h1>
      <ul>
        {transactions.map((e) => (
          <li key={e.id}>
            {e.item_details}: {e.category}: ₹{e.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddNewExpense;
