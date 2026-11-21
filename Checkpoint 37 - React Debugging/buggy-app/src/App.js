import React from 'react';
import UserProfile from './components/UserProfile';
import TaskList from './components/TaskList';
import CounterPanel from './components/CounterPanel';

function App() {
  const sampleTasks = [
    { id: 1, title: 'Inspect Component Tree in React DevTools', completed: false },
    { id: 2, title: 'Fix Props and State Bugs', completed: false },
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', fontFamily: 'sans-serif' }}>
      <h1>React Developer Tools Debugging Lab</h1>

      {/* FIX 1: Corrected prop name to 'username' and passed missing 'status' prop */}
      <UserProfile username="Golden-Joe" role="Software Engineer" status="Active" />

      {/* FIX 3: Matched prop name 'initialTasks' expected by TaskList */}
      <TaskList initialTasks={sampleTasks} />

      {/* FIX 4: Passed 'step' as a numeric expression {5} instead of string "5" */}
      <CounterPanel step={5} />
    </div>
  );
}

export default App;