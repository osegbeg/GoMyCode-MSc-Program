import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = () => {
  const [listOfUSer, setListOfUSer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        setListOfUSer(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch users.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="status-text">Loading users...</p>;
  }

  if (error) {
    return <p className="status-text error">Error: {error}</p>;
  }

  return (
    <div className="user-grid">
      {listOfUSer.map((user) => (
        <article key={user.id} className="user-card">
          <div className="user-card-header">
            <span className="avatar">{user.name.charAt(0)}</span>
            <div>
              <h2>{user.name}</h2>
              <p className="username">@{user.username}</p>
            </div>
          </div>

          <ul className="user-details">
            <li>
              <strong>Email:</strong> {user.email}
            </li>
            <li>
              <strong>Phone:</strong> {user.phone}
            </li>
            <li>
              <strong>Company:</strong> {user.company.name}
            </li>
            <li>
              <strong>City:</strong> {user.address.city}
            </li>
            <li>
              <strong>Website:</strong> {user.website}
            </li>
          </ul>
        </article>
      ))}
    </div>
  );
};

export default UserList;