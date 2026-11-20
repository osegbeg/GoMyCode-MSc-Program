import React from 'react';
import Greeting from './Greeting';
import Counter from './Counter';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      {/* TypeScript checks that 'name' is passed as a string */}
      <Greeting name="Golden-Joe" />
      <hr />
      <Counter />
    </div>
  );
};

export default App;