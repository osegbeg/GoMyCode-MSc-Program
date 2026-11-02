// src/PlayersList.js
import React from 'react';
import Player from './Player';
import players from './players';
import { Container, Row, Col } from 'react-bootstrap';

function PlayersList() {
  return (
    <Container className="py-5">
      <h1 className="text-center mb-4 fw-bold text-primary">Ultimate Football Icons</h1>
      <Row className="justify-content-center">
        {players.map((player, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
            {/* Using the spread operator (...) to pass all player properties as props */}
            <Player {...player} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PlayersList;