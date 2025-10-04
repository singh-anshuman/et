import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/home';
import { Container } from 'react-bootstrap';
import AppHeader from './components/AppHeader';

function App() {
  return (
    <Container className="p-3">
      <AppHeader />
      <Home />
    </Container>
  );
}

export default App;
