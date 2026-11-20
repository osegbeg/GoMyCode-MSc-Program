import React, { Component } from 'react';

// Step 1: Define an interface for Props (empty since Counter takes no props)
interface CounterProps {}

// Step 2: Define an interface for State so TypeScript knows 'count' is a number
interface CounterState {
  count: number;
}

// Step 3: Pass CounterProps and CounterState as generics to React's Component class
class Counter extends Component<CounterProps, CounterState> {
  // Step 4: Explicitly type the initial state object using CounterState
  state: CounterState = {
    count: 0,
  };

  // Step 5: Annotate the arrow function return type as 'void' since it does not return a value.
  // TypeScript automatically verifies that setState receives a valid CounterState property.
  increment = (): void => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    // Note: Keep '(' on the same line as 'return' to avoid Automatic Semicolon Insertion issues
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

export default Counter;