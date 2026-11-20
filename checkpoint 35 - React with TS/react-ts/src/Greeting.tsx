import React from 'react';

// Step 1: Define an interface describing the expected props and their types.
// Here, 'name' is required and must be a string.
interface GreetingProps {
  name: string;
}

// Step 2: Type the functional component using React.FC<GreetingProps>
// (or by typing the destructured parameter directly: ({ name }: GreetingProps))
const Greeting: React.FC<GreetingProps> = ({ name }) => {
  return <div>Hello, {name}!</div>;
};

export default Greeting;