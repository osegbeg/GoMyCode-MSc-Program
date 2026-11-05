// src/AddMovie.js
import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

function AddMovie({ onAddMovie }) {
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    posterURL: '',
    rating: 1
  });

  const handleChange = (e) => {
    setNewMovie({ ...newMovie, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMovie.title || !newMovie.description || !newMovie.posterURL) return;
    
    // Pass the new movie up to App.js, converting rating to a number
    onAddMovie({ ...newMovie, rating: Number(newMovie.rating) });
    
    // Reset form fields
    setNewMovie({ title: '', description: '', posterURL: '', rating: 1 });
  };

  return (
    <Card className="p-4 mb-5 shadow-sm bg-light border-0" style={{ borderRadius: '15px' }}>
      <h4 className="mb-3 fw-bold text-primary">Add a New Movie</h4>
      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col md={6}>
            <Form.Control 
              name="title" 
              placeholder="Movie Title" 
              value={newMovie.title} 
              onChange={handleChange} 
              required 
            />
          </Col>
          <Col md={6}>
            <Form.Control 
              name="posterURL" 
              placeholder="Poster Image URL" 
              value={newMovie.posterURL} 
              onChange={handleChange} 
              required 
            />
          </Col>
          <Col md={12}>
            <Form.Control 
              as="textarea" 
              rows={2} 
              name="description" 
              placeholder="Short Description" 
              value={newMovie.description} 
              onChange={handleChange} 
              required 
            />
          </Col>
          <Col md={4}>
            <Form.Control 
              type="number" 
              min="1" 
              max="5" 
              name="rating" 
              placeholder="Rating (1-5)" 
              value={newMovie.rating} 
              onChange={handleChange} 
              required 
            />
          </Col>
          <Col md={8} className="d-flex align-items-end">
            <Button variant="success" type="submit" className="w-100 fw-bold shadow-sm">
              + Add Movie to Collection
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default AddMovie;