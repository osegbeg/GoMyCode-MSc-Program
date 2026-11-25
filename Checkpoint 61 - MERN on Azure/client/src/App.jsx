import { useEffect, useState } from "react";

const emptyForm = { name: "", email: "", age: "" };

export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchUsers() {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/users");
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load users");
      setUsers(json.data || []);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setStatusMsg("");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      age: form.age === "" ? undefined : Number(form.age),
    };

    try {
      const url = editingId ? `/users/${editingId}` : "/users";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Request failed");

      setStatusMsg(editingId ? "User updated." : "User added.");
      setForm(emptyForm);
      setEditingId(null);
      await fetchUsers();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  function startEdit(user) {
    setEditingId(user._id);
    setForm({
      name: user.name || "",
      email: user.email || "",
      age: user.age ?? "",
    });
    setStatusMsg("");
    setErrorMsg("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleDelete(id) {
    setErrorMsg("");
    setStatusMsg("");
    try {
      const res = await fetch(`/users/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Delete failed");
      setStatusMsg("User removed.");
      if (editingId === id) cancelEdit();
      await fetchUsers();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  return (
    <main style={{ maxWidth: 760, margin: "2rem auto", fontFamily: "system-ui, sans-serif", padding: "0 1rem" }}>
      <h1>MERN User Manager</h1>
      <p style={{ color: "#555" }}>React + Express + MongoDB hosted on Azure App Service</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem", marginBottom: "1.5rem", padding: "1rem", border: "1px solid #ddd", borderRadius: 8 }}>
        <strong>{editingId ? "Edit User" : "Add New User"}</strong>
        <input
          type="text"
          name="name"
          placeholder="Full Name *"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address *"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age (optional)"
          min="0"
          value={form.age}
          onChange={handleChange}
        />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit">{editingId ? "Save Changes" : "Create User"}</button>
          {editingId && (
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {statusMsg && <p style={{ color: "green" }}>{statusMsg}</p>}
      {errorMsg && <p style={{ color: "crimson" }}>{errorMsg}</p>}

      <h2>Users ({users.length})</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users in the database yet.</p>
      ) : (
        <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ccc" }}>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.age ?? "—"}</td>
                <td style={{ display: "flex", gap: "0.4rem" }}>
                  <button type="button" onClick={() => startEdit(u)}>Edit</button>
                  <button type="button" onClick={() => handleDelete(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
