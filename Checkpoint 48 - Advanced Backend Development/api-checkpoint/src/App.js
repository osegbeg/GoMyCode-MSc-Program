import React from "react";
import UserList from "./UserList";
import "./App.css";

function App() {
  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>User Directory</h1>
        <p>Fetched from JSONPlaceholder REST API via Axios</p>
      </header>
      <main>
        <UserList />
      </main>
    </div>
  );
}

export default App;