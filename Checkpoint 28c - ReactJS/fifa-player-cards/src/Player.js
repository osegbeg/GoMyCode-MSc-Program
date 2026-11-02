// src/Player.js
import React from 'react';
import { Card } from 'react-bootstrap';

function Player({ name, team, nationality, jerseyNumber, age, image }) {
  // Inline styling for the card
  const cardStyle = {
    width: '18rem',
    margin: '1rem',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease-in-out',
    backgroundColor: '#f8f9fa'
  };

  const imageStyle = {
    height: '240px',
    objectFit: 'cover',
    borderTopLeftRadius: '15px',
    borderTopRightRadius: '15px'
  };

  return (
    <Card style={cardStyle}>
      <Card.Img variant="top" src={image} alt={name} style={imageStyle} />
      <Card.Body className="text-center">
        <Card.Title className="fw-bold">{name}</Card.Title>
        <Card.Text>
          <strong>Team:</strong> {team} <br />
          <strong>Nationality:</strong> {nationality} <br />
          <strong>Jersey No:</strong> {jerseyNumber} <br />
          <strong>Age:</strong> {age}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

// Defining default props as required by the instructions
Player.defaultProps = {
  name: "Unknown Player",
  team: "Unknown Team",
  nationality: "Unknown",
  jerseyNumber: 0,
  age: 0,
  image: "https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
};

export default Player;