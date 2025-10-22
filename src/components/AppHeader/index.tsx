import { Nav, Navbar } from 'react-bootstrap';

const AppHeader: React.FC<{}> = () => {
    return (
        <>
            <Navbar
                style={{ paddingLeft: '20px' }}
                expand="lg"
                bg="dark"
                data-bs-theme="dark"
                className="bg-body-tertiary"
            >
                <Navbar.Brand href="/et">Balancio</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#add-edit-transaction">
                            <i className="bi bi-plus-circle-fill"></i>
                            <span style={{ marginLeft: '5px' }}>
                                Add Transaction
                            </span>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
};

export default AppHeader;
