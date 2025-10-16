import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import { Container } from 'react-bootstrap';
import AppHeader from './components/AppHeader';
import { Route, Routes } from 'react-router-dom';
import AddEditTransaction from './components/AddEditTransaction';

function App() {
    return (
        <Container className="p-3">
            <AppHeader />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/add-edit-transaction"
                    element={<AddEditTransaction />}
                />
            </Routes>
        </Container>
    );
}

export default App;
