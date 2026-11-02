import React from 'react';
import product from './product';

function Description() {
  return <p className="text-muted">{product.description}</p>;
}

export default Description;