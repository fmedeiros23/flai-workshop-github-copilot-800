import React, { useEffect, useState } from 'react';

// The API returns members as a Python-style string e.g. "['alice', 'bob']"
// Parse it into a proper JS array.
function parseMembers(members) {
  if (Array.isArray(members)) return members;
  if (typeof members === 'string') {
    return members
      .replace(/^\[|\]$/g, '')          // strip surrounding [ ]
      .split(',')
      .map(s => s.trim().replace(/^['"]|['"]$/g, ''))  // remove quotes
      .filter(s => s.length > 0);
  }
  return [];
}

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  useEffect(() => {
    console.log('Teams: fetching from', apiUrl);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Teams: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setTeams(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Teams: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="mt-2">
      <h2 className="page-heading">👥 Teams</h2>
      {error && (
        <div className="alert alert-danger octofit-alert" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}
      <div className="card octofit-card">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border" style={{ color: '#e94560' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading teams...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table octofit-table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Team Name</th>
                    <th>Members</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.length === 0 ? (
                    <tr><td colSpan="4" className="text-center text-muted py-4">No teams found.</td></tr>
                  ) : (
                    teams.map((team, index) => {
                      const memberList = parseMembers(team.members);
                      return (
                        <tr key={team._id || team.id || team.name}>
                          <td><span className="badge bg-secondary">{index + 1}</span></td>
                          <td><strong>{team.name}</strong></td>
                          <td>
                            {memberList.map((m, i) => (
                              <span key={i} className="badge me-1" style={{ background: '#16213e', color: '#cdd9e5' }}>{m}</span>
                            ))}
                          </td>
                          <td><span className="badge" style={{ background: '#e94560', color: '#fff' }}>{memberList.length}</span></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card-footer text-muted small">
          {teams.length} team{teams.length !== 1 ? 's' : ''} &mdash; <code>{apiUrl}</code>
        </div>
      </div>
    </div>
  );
}

export default Teams;
