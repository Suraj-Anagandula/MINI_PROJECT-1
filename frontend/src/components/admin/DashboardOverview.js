 


import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DashboardOverview = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchComplaints = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token') || null;

      const endpoints = [
        `${BASE}/api/complaints`,
        `${BASE}/complaints`,
        `${BASE}/admin/complaints`,
      ];

      let lastError = null;

      for (const url of endpoints) {
        try {
          const res = await axios.get(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            timeout: 8000,
          });

          const data = res.data;
          if (Array.isArray(data)) {
            if (!mounted) return;
            setComplaints(data);
            setLoading(false);
            return;
          }
          if (data && Array.isArray(data.complaints)) {
            if (!mounted) return;
            setComplaints(data.complaints);
            setLoading(false);
            return;
          }
          if (data && data.data && Array.isArray(data.data.complaints)) {
            if (!mounted) return;
            setComplaints(data.data.complaints);
            setLoading(false);
            return;
          }
          if (data && Array.isArray(data.results)) {
            if (!mounted) return;
            setComplaints(data.results);
            setLoading(false);
            return;
          }
          if (data && Array.isArray(data.docs)) {
            if (!mounted) return;
            setComplaints(data.docs);
            setLoading(false);
            return;
          }
          if (data && data.complaints && Array.isArray(data.complaints.docs)) {
            if (!mounted) return;
            setComplaints(data.complaints.docs);
            setLoading(false);
            return;
          }
          if (data && typeof data === 'object' && (data.title || data.ticketId || data.status)) {
            if (!mounted) return;
            setComplaints([data]);
            setLoading(false);
            return;
          }
          lastError = new Error(`Unexpected response shape from ${url}`);
        } catch (err) {
          lastError = err;
          continue;
        }
      }

      if (!mounted) return;
      const msg = lastError
        ? (lastError.response
            ? `Server error ${lastError.response.status}: ${lastError.response.data?.message || lastError.message}`
            : `Network error: ${lastError.message}`)
        : 'Unable to fetch complaints.';
      setError(msg);
      setLoading(false);
    };

    fetchComplaints();

    return () => {
      mounted = false;
    };
  }, []);

  const getFileUrl = (file) => {
    if (!file) return null;
    
    // If it's a Base64 image, return it directly
    if (typeof file === 'string' && isBase64Image(file)) {
      return file;
    }
    
    // If it's a string URL
    if (typeof file === 'string') {
      return file.startsWith('http') ? file : `${BASE}/${file.replace(/^\/+/, '')}`;
    }
    
    // If it's an array of files
    if (Array.isArray(file) && file.length > 0) {
      const f = file[0];
      if (typeof f === 'string') return f.startsWith('http') ? f : `${BASE}/${f.replace(/^\/+/, '')}`;
      if (f && (f.url || f.path)) {
        const url = f.url || f.path;
        return url.startsWith('http') ? url : `${BASE}/${url.replace(/^\/+/, '')}`;
      }
    }
    
    // If it's a file object
    if (file && (file.url || file.path)) {
      const url = file.url || file.path;
      return url.startsWith('http') ? url : `${BASE}/${url.replace(/^\/+/, '')}`;
    }
    
    return null;
  };

  const isImageFile = (url) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const isBase64Image = (str) => {
    if (typeof str !== 'string') return false;
    return str.startsWith('data:image/');
  };

  const getStudentId = (c) =>
    c?.student?.studentId || c?.student?.studentID || c?.student?.id || c?.studentId || c?.student || 'Unknown';

  const getTitle = (c) => c.title || c.subject || 'No title';
  const getDescription = (c) => c.description || c.details || c.body || 'No description provided';
  const getStatus = (c) => c.status || 'unknown';

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
        <span className="ms-2">Loading complaints...</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">All Student Complaints</h2>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
          <button className="btn btn-sm btn-outline-light ms-3" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {complaints.length === 0 ? (
        <p className="text-muted text-center">No complaints submitted yet.</p>
      ) : (
        <div className="row">
          {complaints.map((complaint) => {
            const submittedAt = complaint.createdAt ? new Date(complaint.createdAt) : null;

            return (
              <div className="col-md-6 mb-4" key={complaint._id || complaint.id || `${getStudentId(complaint)}-${getTitle(complaint)}`}>
                <div className="card shadow-sm border-light h-100">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">Student ID</small>
                      <div><strong>{getStudentId(complaint)}</strong></div>
                    </div>
                    <div>
                      <span
                        className={`badge ${
                          getStatus(complaint) === 'resolved'
                            ? 'bg-success'
                            : getStatus(complaint) === 'in-progress'
                            ? 'bg-info'
                            : 'bg-warning'
                        }`}
                      >
                        {getStatus(complaint)}
                      </span>
                    </div>
                  </div>

                  <div className="card-body">
                    <h5 className="card-title">{getTitle(complaint)}</h5>
                    <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}>
                      {getDescription(complaint)}
                    </p>

                    <div className="d-flex gap-2">
                      {/* Only show view details button */}
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        <i className="fas fa-info-circle me-1"></i>View Details
                      </button>
                    </div>
                  </div>

                  <div className="card-footer text-muted small">
                    {submittedAt ? (
                      <>Submitted on {submittedAt.toLocaleDateString()} at {submittedAt.toLocaleTimeString()}</>
                    ) : (
                      'Submission time unknown'
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for complaint details */}
      {selectedComplaint && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Complaint Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedComplaint(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <strong>Student ID:</strong>
                      <p className="mb-0">{getStudentId(selectedComplaint)}</p>
                    </div>
                    <div className="mb-3">
                      <strong>Title:</strong>
                      <p className="mb-0">{getTitle(selectedComplaint)}</p>
                    </div>
                    <div className="mb-3">
                      <strong>Status:</strong>
                      <span
                        className={`badge ${
                          getStatus(selectedComplaint) === 'resolved'
                            ? 'bg-success'
                            : getStatus(selectedComplaint) === 'in-progress'
                            ? 'bg-info'
                            : 'bg-warning'
                        }`}
                      >
                        {getStatus(selectedComplaint)}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <strong>Submitted:</strong>
                      <p className="mb-0">
                        {selectedComplaint.createdAt 
                          ? new Date(selectedComplaint.createdAt).toLocaleString() 
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div className="mb-3">
                      <strong>Category:</strong>
                      <p className="mb-0 text-capitalize">
                        {selectedComplaint.category || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <strong>Description:</strong>
                  <div className="border p-3 rounded bg-light">
                    {getDescription(selectedComplaint)}
                  </div>
                </div>

                {/* Image section - show complaint images if available */}
                {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                  <div className="mb-3">
                    <strong>Complaint Images:</strong>
                    <div className="mt-3">
                      <div className="row">
                        {selectedComplaint.images.map((image, index) => {
                          // Get the correct image URL
                          const imageUrl = isBase64Image(image) 
                            ? image 
                            : (isBase64Image(image.url) 
                                ? image.url 
                                : getFileUrl(image));
                                
                          return (
                            <div key={index} className="col-md-4 mb-3">
                              <div className="card">
                                <img 
                                  src={imageUrl}
                                  alt={`Complaint image ${index + 1}`}
                                  className="card-img-top"
                                  style={{ height: '300px',width:'300px', /*objectFit: 'cover'*/ }}
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/200x200?text=Image+Not+Found';
                                  }}
                                />
                                {/* <div className="card-body p-2">
                                  <small className="text-muted">{image.originalname || image.filename || `Image ${index + 1}`}</small>
                                </div> */}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedComplaint(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;