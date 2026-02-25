import React, { useEffect, useState } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  useEffect(() => {
    console.log('Workouts: fetching from', apiUrl);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Workouts: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setWorkouts(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="mt-2">
      <h2 className="page-heading">💪 Workouts</h2>
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
              <p className="mt-2 text-muted">Loading workouts...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table octofit-table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Exercises</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.length === 0 ? (
                    <tr><td colSpan="4" className="text-center text-muted py-4">No workouts found.</td></tr>
                  ) : (
                    workouts.map((workout, index) => (
                      <tr key={workout._id || workout.id || workout.name}>
                        <td><span className="badge bg-secondary">{index + 1}</span></td>
                        <td><strong>{workout.name}</strong></td>
                        <td className="text-muted">{workout.description}</td>
                        <td>
                          {Array.isArray(workout.exercises)
                            ? workout.exercises.map((ex, i) => (
                                <span key={i} className="badge me-1 mb-1" style={{ background: '#e94560', color: '#fff', fontWeight: 500 }}>
                                  {ex}
                                </span>
                              ))
                            : workout.exercises}
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
          {workouts.length} workout{workouts.length !== 1 ? 's' : ''} &mdash; <code>{apiUrl}</code>
        </div>
      </div>
    </div>
  );
}

export default Workouts;
