import React, { useEffect, useState } from 'react';

const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  useEffect(() => {
    console.log('Leaderboard: fetching from', apiUrl);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Leaderboard: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setEntries(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="mt-2">
      <h2 className="page-heading">🏆 Leaderboard</h2>
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
              <p className="mt-2 text-muted">Loading leaderboard...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table octofit-table mb-0">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Team</th>
                    <th>Total Calories</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length === 0 ? (
                    <tr><td colSpan="5" className="text-center text-muted py-4">No entries found.</td></tr>
                  ) : (
                    entries.map((entry, index) => (
                      <tr key={entry._id || entry.id || index}>
                        <td>
                          <span
                            className="rank-badge"
                            style={{
                              background: medalColors[index] || '#e9ecef',
                              color: index < 3 ? '#1a1a2e' : '#555',
                            }}
                          >
                            {index + 1}
                          </span>
                        </td>
                        <td><strong>{entry.user}</strong></td>
                        <td>{entry.team || 'N/A'}</td>
                        <td>{entry.total_calories != null ? entry.total_calories : 0} kcal</td>
                        <td>
                          <span className="fw-bold" style={{ color: '#e94560' }}>{entry.score}</span>
                          <div className="progress mt-1" style={{ height: '4px' }}>
                            <div
                              className="progress-bar"
                              style={{
                                width: `${Math.min(100, entry.score)}%`,
                                background: '#e94560',
                              }}
                            />
                          </div>
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
          {entries.length} entr{entries.length !== 1 ? 'ies' : 'y'} &mdash; <code>{apiUrl}</code>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
