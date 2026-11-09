// src/MovieCard.js
import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 

function MovieCard({ id, title, description, posterURL, rating }) {
  return (

    <Link to={`/movie/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card style={{ width: '18rem', borderRadius: '15px' }} className="h-100 shadow-sm">
        <Card.Img 
          variant="top" 
          src={posterURL} 
          alt={title} 
          style={{ height: '260px', objectFit: 'cover', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }} 
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="fw-bold">{title}</Card.Title>
          <Card.Text className="text-muted flex-grow-1" style={{ fontSize: '0.9rem' }}>
            {description}
          </Card.Text>
          <div className="text-warning fw-bold mt-2">
            {'★'.repeat(rating)} {'☆'.repeat(5 - rating)} <span className="text-dark">({rating}/5)</span>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default MovieCard;