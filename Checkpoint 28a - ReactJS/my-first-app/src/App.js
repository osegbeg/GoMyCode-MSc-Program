import React from 'react';
import { Container, Navbar, Nav, Card, Row, Col } from 'react-bootstrap';

function App() {
  return (
    <>
      <div className="App">
        {/* 1. React-Bootstrap Navbar */}
        <Navbar bg="dark" variant="dark" expand="lg" className="px-3 mb-4">
          <Navbar.Brand href="#home">My React App</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
          </Nav>
        </Navbar>

        <Container>
          {/* 2. Heading */}
          <h1 className="text-center mb-4">Welcome to My First React App</h1>

          {/* 3. Three Cards arranged in a responsive Grid */}
          <Row>
            <Col md={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>Modular Code</Card.Title>
                  <Card.Text>Built using reusable components to keep things clean and efficient.</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>High Performance</Card.Title>
                  <Card.Text>Leveraging React's Virtual DOM for fast, optimized rendering cycles.</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>Unidirectional Flow</Card.Title>
                  <Card.Text>Predictable data management flowing strictly down from parent to child.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default App;
