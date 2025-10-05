import { Nav, Navbar } from 'react-bootstrap';

const AppHeader: React.FC<{}> = () => {
  return (
    <>
      <Navbar
        style={{ paddingLeft: '20px' }}
        expand="lg"
        className="bg-body-tertiary"
      >
        <Navbar.Brand href="/">Expense Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#add-transaction">Add Transaction</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default AppHeader;
