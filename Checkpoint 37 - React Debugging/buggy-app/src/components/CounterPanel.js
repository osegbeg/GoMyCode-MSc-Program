import React, { useState } from 'react';

function CounterPanel({ step }) {
  const [count, setCount] = useState(0);

  return (
    <div style={{ border: '1px solid #ccc', padding: '12px' }}>
      <h3>Points Counter</h3>
      <p>Current Score: {count}</p>
      <button onClick={() => setCount(count + step)}>Add +{step}</button>
    </div>
  );
}

export default CounterPanel;