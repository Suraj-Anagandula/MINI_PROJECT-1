 import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const Statistics = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    resolutionRate: 0,
    avgDaysToResolve: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0
  });
  const [socket, setSocket] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const SOCKET_BASE = API_BASE.replace(/\/api\/?$/, '');

  useEffect(() => {
    // Establish WebSocket connection
    const newSocket = io(SOCKET_BASE);
    setSocket(newSocket);

    // Listen for complaint updates
    newSocket.on("complaintUpdated", () => {
      fetchStats();
    });

    return () => newSocket.close();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/complaints/stats/home/overview`);
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching statistics:", err.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">System Statistics</h2>
          <p className="text-muted">Live tracking of complaint resolution</p>
        </div>
        <div className="row g-4">
          <div className="col-md-3 col-6">
            <div className="card stats-box text-center p-4 border-0 shadow-sm">
              <div className="stats-number display-6 fw-bold text-primary">{stats.totalComplaints}</div>
              <div className="stats-label text-muted">Total Complaints</div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card stats-box text-center p-4 border-0 shadow-sm">
              <div className="stats-number display-6 fw-bold text-success">{stats.resolvedComplaints}</div>
              <div className="stats-label text-muted">Resolved Issues</div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card stats-box text-center p-4 border-0 shadow-sm">
              <div className="stats-number display-6 fw-bold text-info">{stats.resolutionRate}%</div>
              <div className="stats-label text-muted">Resolution Rate</div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card stats-box text-center p-4 border-0 shadow-sm">
              <div className="stats-number display-6 fw-bold text-warning">{stats.avgDaysToResolve}</div>
              <div className="stats-label text-muted">Avg. Days to Resolve</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;