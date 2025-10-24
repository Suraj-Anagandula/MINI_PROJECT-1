 import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const RecentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/complaints/recent/public`);
        setComplaints(res.data.complaints);
      } catch (error) {
        console.error('Error fetching recent complaints:', error);
      }
    };

    fetchComplaints();
  }, []);

  const getStatusBadge = (status) => {
    const statusStyles = {
      'pending': 'badge-pending',
      'in-progress': 'badge-in-progress',
      'resolved': 'badge-resolved',
      'rejected': 'badge-rejected'
    };
    
    return (
      <span className={`badge complaint-status-badge ${statusStyles[status] || 'bg-secondary'} px-2 py-1`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'electrical': '⚡',
      'plumbing': '🚰',
      'carpentry': '🛠️',
      'cleaning': '🧹',
      'internet': '🌐',
      'furniture': '🪑',
      'other': '📝'
    };
    return icons[category] || '📋';
  };

  return (
    <section className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0 recent-complaints-card">
            <div className="card-header bg-primary text-white py-3">
              <h3 className="mb-0">
                <i className="fas fa-list-alt me-2"></i>
                Recent Complaints
              </h3>
              <p className="mb-0 mt-1 small opacity-75">Latest complaints submitted by students</p>
            </div>
            <div className="card-body p-4">
              {complaints.length === 0 ? (
                <div className="text-center py-5 empty-complaints-state">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <p className="text-muted mb-0">No complaints available at the moment</p>
                </div>
              ) : (
                <div className="recent-complaints-container">
                  <div 
                    className={`recent-complaints-track ${isPaused ? 'paused' : ''}`}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    {/* First set of complaints */}
                    <div className="recent-complaints-set">
                      {complaints.map((complaint, index) => (
                        <div key={`first-${complaint._id}`} className="complaint-box-item">
                          <div className="complaint-box card h-100 border-0 shadow-sm">
                            <div className="card-body">
                              <div className="d-flex align-items-start mb-3">
                                <div className="category-icon me-3">
                                  {getCategoryIcon(complaint.category)}
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="card-title fw-bold text-dark mb-1">{complaint.title}</h6>
                                  {getStatusBadge(complaint.status)}
                                </div>
                              </div>
                              
                              <div className="complaint-meta">
                                <div className="d-flex flex-column gap-2 text-muted small">
                                  <div className="d-flex align-items-center">
                                    <i className="fas fa-tag me-2 text-primary"></i>
                                    <span>{complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}</span>
                                  </div>
                                  {/* <div className="d-flex align-items-center">
                                    <i className="fas fa-user me-2 text-success"></i>
                                    <span>{complaint.student?.name || 'Anonymous'}</span>
                                  </div> */}
                                  <div className="d-flex align-items-center">
                                    <i className="fas fa-clock me-2 text-warning"></i>
                                    <span>
                                      {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Duplicate set for seamless looping */}
                    <div className="recent-complaints-set">
                      {complaints.map((complaint, index) => (
                        <div key={`second-${complaint._id}`} className="complaint-box-item">
                          <div className="complaint-box card h-100 border-0 shadow-sm">
                            <div className="card-body">
                              <div className="d-flex align-items-start mb-3">
                                <div className="category-icon me-3">
                                  {getCategoryIcon(complaint.category)}
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="card-title fw-bold text-dark mb-1">{complaint.title}</h6>
                                  {getStatusBadge(complaint.status)}
                                </div>
                              </div>
                              
                              <div className="complaint-meta">
                                <div className="d-flex flex-column gap-2 text-muted small">
                                  <div className="d-flex align-items-center">
                                    <i className="fas fa-tag me-2 text-primary"></i>
                                    <span>{complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}</span>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <i className="fas fa-user me-2 text-success"></i>
                                    <span>{complaint.student?.name || 'Anonymous'}</span>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <i className="fas fa-clock me-2 text-warning"></i>
                                    <span>
                                      {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* {complaints.length > 0 && (
              <div className="card-footer bg-light py-3">
                <div className="text-center">
                  <small className="text-muted">
                    {complaints.length} recent complaints • Scroll or hover to pause
                  </small>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentComplaints;