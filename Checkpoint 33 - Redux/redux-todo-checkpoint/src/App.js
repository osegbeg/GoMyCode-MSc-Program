import React from 'react';
import AddTask from './components/AddTask';
import ListTask from './components/ListTask';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1>Redux To-Do Application</h1>
      <AddTask />
      <ListTask />
    </div>
  );
}

export default App;