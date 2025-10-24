import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/complaints/stats/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Analytics & Reports</h2>
      
      <div className="row mb-4">
        <div className="col-md-2 col-6 mb-3">
          <div className="card bg-primary text-white text-center p-3">
            <h3>{stats.total || 0}</h3>
            <p className="mb-0">Total Complaints</p>
          </div>
        </div>
        <div className="col-md-2 col-6 mb-3">
          <div className="card bg-success text-white text-center p-3">
            <h3>{stats.resolved || 0}</h3>
            <p className="mb-0">Resolved</p>
          </div>
        </div>
        <div className="col-md-2 col-6 mb-3">
          <div className="card bg-warning text-white text-center p-3">
            <h3>{stats.pending || 0}</h3>
            <p className="mb-0">Pending</p>
          </div>
        </div>
        <div className="col-md-2 col-6 mb-3">
          <div className="card bg-info text-white text-center p-3">
            <h3>{stats.inProgress || 0}</h3>
            <p className="mb-0">In Progress</p>
          </div>
        </div>
        <div className="col-md-4 col-12 mb-3">
          <div className="card bg-dark text-white text-center p-3">
            <h3>
              {stats.resolutionRate ? stats.resolutionRate.toFixed(2) : "0.00"}%
            </h3>
            <p className="mb-0">Resolution Rate</p>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Category Statistics */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Category Statistics</h5>
            </div>
            <div className="card-body">
              {stats.categoryStats && stats.categoryStats.length > 0 ? (
                <div className="list-group">
                  {stats.categoryStats.map(category => (
                    <div 
                      key={category._id} 
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span className="text-capitalize">{category._id}</span>
                      <div>
                        <span className="badge bg-primary me-2">
                          Total: {category.count}
                        </span>
                        <span className="badge bg-success me-2">
                          Resolved: {category.resolved || 0}
                        </span>
                        <span className="badge bg-warning me-2">
                          Pending: {category.pending || 0}
                        </span>
                        <span className="badge bg-info">
                          In Progress: {category.inProgress || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No category data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Performance Metrics</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>Average Resolution Time:</strong>{' '}
                {stats.avgResolutionTime
                  ? `${stats.avgResolutionTime.toFixed(1)} days`
                  : 'N/A'}
              </div>
              <div className="mb-3">
                <strong>Recently Resolved (7 days):</strong>{' '}
                {stats.recentlyResolved || 0} complaints
              </div>
              {/* In Progress removed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
