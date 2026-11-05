// src/Filter.js
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

function Filter({ titleFilter, setTitleFilter, ratingFilter, setRatingFilter }) {
  return (
    <Row className="mb-4 g-3 justify-content-center">
      <Col xs={12} md={6}>
        <Form.Control
          type="text"
          placeholder="🔍 Search movies by title..."
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className="shadow-sm"
        />
      </Col>
      <Col xs={12} md={3}>
        <Form.Control
          type="number"
          min="0"
          max="5"
          placeholder="⭐ Minimum Rating (0-5)"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="shadow-sm"
        />
      </Col>
    </Row>
  );
}

export default Filter;