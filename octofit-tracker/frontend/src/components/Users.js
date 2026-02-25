import React, { useEffect, useState, useCallback } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', email: '', password: '', team_id: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';
  const teamsUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';
  const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';

  const fetchUsers = useCallback(() => {
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setUsers(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  useEffect(() => {
    fetchUsers();
    fetch(teamsUrl)
      .then((res) => res.json())
      .then((data) => setTeams(Array.isArray(data) ? data : data.results || []))
      .catch(() => {});
  }, [fetchUsers, teamsUrl]);

  const openEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      password: user.password || '',
      team_id: user.team ? user.team.id : '',
    });
    setSaveError(null);
  };

  const closeEdit = () => {
    setEditingUser(null);
    setEditForm({ username: '', email: '', password: '', team_id: '' });
    setSaveError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      // Update user fields
      const res = await fetch(`${apiUrl}${editingUser.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: editForm.username,
          email: editForm.email,
          ...(editForm.password ? { password: editForm.password } : {}),
        }),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);

      // Update team assignment
      const teamChanged = editForm.team_id !== (editingUser.team ? editingUser.team.id : '');
      if (teamChanged || editForm.team_id !== (editingUser.team ? editingUser.team.id : '')) {
        const teamRes = await fetch(`${apiUrl}${editingUser.id}/assign_team/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ team_id: editForm.team_id || null }),
        });
        if (!teamRes.ok) throw new Error(`Team update failed: ${teamRes.status}`);
      }

      closeEdit();
      fetchUsers();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-2">
      <h2 className="page-heading">👤 Users</h2>
      {error && (
        <div className="alert alert-danger octofit-alert" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User — {editingUser.username}</h5>
                <button type="button" className="btn-close" onClick={closeEdit} />
              </div>
              <div className="modal-body">
                {saveError && <div className="alert alert-danger">{saveError}</div>}
                <div className="mb-3">
                  <label className="form-label fw-bold">Username</label>
                  <input
                    className="form-control"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Leave blank to keep unchanged"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Team</label>
                  <select
                    className="form-select"
                    value={editForm.team_id}
                    onChange={(e) => setEditForm({ ...editForm, team_id: e.target.value })}
                  >
                    <option value="">— No team —</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeEdit} disabled={saving}>Cancel</button>
                <button className="btn btn-octofit" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card octofit-card">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border" style={{ color: '#e94560' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading users...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table octofit-table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Team</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan="6" className="text-center text-muted py-4">No users found.</td></tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={user._id || user.id || user.username}>
                        <td><span className="badge bg-secondary">{index + 1}</span></td>
                        <td><strong>{user.username.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</strong></td>
                        <td><code>{user.username}</code></td>
                        <td><a href={`mailto:${user.email}`} className="text-decoration-none">{user.email}</a></td>
                        <td>{user.team ? user.team.name : <span className="text-muted">—</span>}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => openEdit(user)}
                          >
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card-footer text-muted small">
          {users.length} user{users.length !== 1 ? 's' : ''} &mdash; <code>{apiUrl}</code>
        </div>
      </div>
    </div>
  );
}

export default Users;
