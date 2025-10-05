import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import { Container } from 'react-bootstrap';
import AppHeader from './components/AppHeader';
import { Route, Routes } from 'react-router-dom';
import AddNewExpense from './components/AddNewExpense';

function App() {
  return (
    <Container className="p-3">
      <AppHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-transaction" element={<AddNewExpense />} />
      </Routes>
    </Container>
  );
}

export default App;
