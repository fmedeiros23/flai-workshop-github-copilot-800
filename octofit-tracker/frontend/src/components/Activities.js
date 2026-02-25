import React, { useEffect, useState } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

  useEffect(() => {
    console.log('Activities: fetching from', apiUrl);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Activities: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setActivities(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Activities: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="mt-2">
      <h2 className="page-heading">🏃 Activities</h2>
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
              <p className="mt-2 text-muted">Loading activities...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table octofit-table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Activity Type</th>
                    <th>Duration (min)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.length === 0 ? (
                    <tr><td colSpan="5" className="text-center text-muted py-4">No activities found.</td></tr>
                  ) : (
                    activities.map((activity, index) => (
                      <tr key={activity._id || activity.id}>
                        <td><span className="badge bg-secondary">{index + 1}</span></td>
                        <td><strong>{activity.user}</strong></td>
                        <td>
                          <span className="badge" style={{ background: '#0f3460', color: '#fff' }}>
                            {activity.activity_type}
                          </span>
                        </td>
                        <td>{activity.duration} min</td>
                        <td>{new Date(activity.date + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card-footer text-muted small">
          {activities.length} activit{activities.length !== 1 ? 'ies' : 'y'} &mdash; <code>{apiUrl}</code>
        </div>
      </div>
    </div>
  );
}

export default Activities;
