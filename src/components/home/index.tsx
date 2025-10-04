import { Button } from 'react-bootstrap';
import AddNewExpense from '../AddNewExpense';
import { useState } from 'react';

const Home: React.FC<{}> = () => {
  const [showAddNewExpense, setShowAddNewExpense] = useState(false);

  const handleShowAddNewExpense = () => {
    setShowAddNewExpense(true);
  };

  return (
    <>
      {/* <Button variant="primary" onClick={handleShowAddNewExpense}>
        Add New Expense
      </Button>
      {showAddNewExpense && <AddNewExpense />} */}
    </>
  );
};

export default Home;
