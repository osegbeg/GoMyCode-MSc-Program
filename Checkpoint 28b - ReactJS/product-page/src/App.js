import React from 'react';
import { Container, Card } from 'react-bootstrap';
import Name from './Name';
import Price from './Price';
import Description from './Description';
import Image from './Image';

const firstName = "Golden-Joe"; 

function App() {
  return (
    <Container className="py-5">
       {/* Greeting and Conditional Image Section */}
      <div className="text-center mt-5">
        <h2 className="fw-bold">
          {firstName ? `Hello, ${firstName}!` : "Hello, there!"}
        </h2>

        {/* Display an image only if firstName is provided */}
        {firstName && (
          <div className="mt-3">
            <img 
              src="https://images.unsplash.com/photo-1740252117044-2af197eea287?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" 
              alt="User Welcome" 
              className="rounded-circle shadow-sm"
              style={{ width: '90px', height: '90px', objectFit: 'cover', border: '3px solid #0d6efd' }}
            />
          </div>
        )}
      </div>


      {/* React-Bootstrap Product Card */}
      <Card style={{ width: '24rem', margin: '0 auto', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
        <Image />
        <Card.Body className="text-center">
          <Name />
          <Price />
          <Description />
        </Card.Body>
      </Card>

     
    </Container>
  );
}

export default App;