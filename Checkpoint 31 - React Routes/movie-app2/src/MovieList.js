// src/MovieList.js
import React from 'react';
import MovieCard from './MovieCard';
import { Row, Col } from 'react-bootstrap';

function MovieList({ movies }) {
  return (
    <Row className="justify-content-center">
      {movies.length > 0 ? (
        movies.map((movie, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center mb-4">
            <MovieCard {...movie} />
          </Col>
        ))
      ) : (
        <h5 className="text-center text-muted my-4">No movies found matching your filter.</h5>
      )}
    </Row>
  );
}

export default MovieList;