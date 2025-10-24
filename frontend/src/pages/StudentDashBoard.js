import React, { useState, useEffect } from 'react';
import StudentNavbar from '.././components/StudentNavbar';
import { complaintsAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('submit-complaint');
  const [complaintData, setComplaintData] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
    priority: 'medium',
    images: [],
    urgency: 'moderate'
  });
  const [myComplaints, setMyComplaints] = useState([]);
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Calculate statistics from complaints data
  const calculateStats = (complaints) => {
    return {
      totalComplaints: complaints.length,
      pendingComplaints: complaints.filter(c => c.status === 'pending').length,
      inProgressComplaints: complaints.filter(c => c.status === 'in-progress').length,
      resolvedComplaints: complaints.filter(c => c.status === 'resolved').length
    };
  };

  useEffect(() => {
    if (activeTab === 'my-complaints') {
      fetchMyComplaints();
    }
  }, [activeTab]);

  const fetchMyComplaints = async () => {
    try {
      const response = await complaintsAPI.getStudentComplaints();
      const complaints = response.data.complaints || [];
      setMyComplaints(complaints);
      setStats(calculateStats(complaints));
    } catch (error) {
      setError('Failed to fetch complaints');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComplaintData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + complaintData.images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    try {
      // Convert files to base64 for local storage
      const imagePromises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              url: e.target.result, // base64 encoded image
              filename: file.name,
              originalname: file.name,
              mimetype: file.type,
              size: file.size
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const newImages = await Promise.all(imagePromises);
      
      setComplaintData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    } catch (error) {
      setError('Failed to process images');
      console.error('Image processing error:', error);
    }
  };

  const removeImage = (index) => {
    const newImages = complaintData.images.filter((_, i) => i !== index);
    setComplaintData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Send complaint data with base64 images
      await complaintsAPI.createComplaint(complaintData);
      setMessage('Complaint submitted successfully!');
      
      // Reset form
      setComplaintData({
        category: '',
        title: '',
        description: '',
        location: '',
        priority: 'medium',
        images: [],
        urgency: 'moderate'
      });

      // Refresh complaints list and update stats
      await fetchMyComplaints();
      
      // Switch to my-complaints tab to show the updated list
      setActiveTab('my-complaints');
    } catch (error) {
      console.error('Submit complaint error:', error);
      setError(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordMessage('');

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      setPasswordLoading(false);
      return;
    }

    try {
      await usersAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowChangePassword(false);
    } catch (error) {
      console.error('Change password error:', error);
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedComplaint(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordMessage('');
    setPasswordError('');
  };

  // Function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-success';
      case 'in-progress':
        return 'bg-info';
      case 'pending':
        return 'bg-warning';
      case 'rejected':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  // Function to get priority badge class
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-danger';
      case 'medium':
        return 'bg-warning';
      case 'low':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="student-dashboard">
      <StudentNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout}
      />
      
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2 sidebar">
            <div className="d-flex flex-column p-3">
              <h5 className="text-center mb-4">Student Dashboard</h5>
              <div className="nav flex-column nav-pills">
                <button 
                  className={`nav-link ${activeTab === 'submit-complaint' ? 'active' : ''}`}
                  onClick={() => setActiveTab('submit-complaint')}
                >
                  <i className="fas fa-plus-circle me-2"></i>Submit Complaint
                </button>
                <button 
                  className={`nav-link ${activeTab === 'my-complaints' ? 'active' : ''}`}
                  onClick={() => setActiveTab('my-complaints')}
                >
                  <i className="fas fa-list me-2"></i>My Complaints
                </button>
                <button 
                  className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="fas fa-user me-2"></i>Profile
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 col-lg-10 main-content">
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {passwordMessage && <div className="alert alert-success">{passwordMessage}</div>}
            {passwordError && <div className="alert alert-danger">{passwordError}</div>}

            {activeTab === 'submit-complaint' && (
              <div className="p-4">
                <h3 className="mb-4">Submit New Complaint</h3>
                
                <form onSubmit={handleSubmitComplaint} className="complaint-form">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category *</label>
                      <select 
                        className="form-select" 
                        name="category"
                        value={complaintData.category}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      >
                        <option value="">Select Category</option>
                        <option value="electrical">Electrical (Fans, Lights, Sockets)</option>
                        <option value="plumbing">Plumbing (Taps, Water Leakage)</option>
                        <option value="carpentry">Carpentry (Doors, Windows, Furniture)</option>
                        <option value="internet">Internet (WiFi, LAN Ports)</option>
                        <option value="sanitation">Sanitation (Cleaning, Pest Control)</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Priority Level</label>
                      <select 
                        className="form-select" 
                        name="priority"
                        value={complaintData.priority}
                        onChange={handleInputChange}
                        disabled={loading}
                      >
                        <option value="low">Low (Can wait)</option>
                        <option value="medium">Medium (Should be fixed soon)</option>
                        <option value="high">High (Urgent - Needs immediate attention)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Complaint Title *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="title"
                      value={complaintData.title}
                      onChange={handleInputChange}
                      placeholder="Brief title of your complaint"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Detailed Description</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      name="description"
                      value={complaintData.description}
                      onChange={handleInputChange}
                      placeholder="Please describe the issue in detail..."
                      disabled={loading}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Location *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="location"
                      value={complaintData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Room No. 205, Block B, Floor 2"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Upload Images (Max 5)</label>
                    <input 
                      type="file" 
                      className="form-control" 
                      multiple 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={loading || complaintData.images.length >= 5}
                    />
                    <div className="form-text">Upload clear photos of the issue. Maximum 5 images allowed.</div>
                    
                    {complaintData.images.length > 0 && (
                      <div className="image-previews mt-3">
                        <h6>Uploaded Images:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {complaintData.images.map((image, index) => (
                            <div key={index} className="position-relative" style={{width: '100px', height: '100px'}}>
                              <img 
                                src={image.url} 
                                alt={`Preview ${index + 1}`}
                                className="img-thumbnail h-100 w-100 object-fit-cover"
                              />
                              <button 
                                type="button" 
                                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                onClick={() => removeImage(index)}
                                disabled={loading}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label">How urgent is this issue?</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="urgency" 
                          value="minor" 
                          checked={complaintData.urgency === 'minor'}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                        <label className="form-check-label">Minor (Can wait a few days)</label>
                      </div>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="urgency" 
                          value="moderate" 
                          checked={complaintData.urgency === 'moderate'}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                        <label className="form-check-label">Moderate (Within 2 days)</label>
                      </div>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="urgency" 
                          value="critical" 
                          checked={complaintData.urgency === 'critical'}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                        <label className="form-check-label">Critical (Immediate attention needed)</label>
                      </div>
                    </div>
                  </div>

                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'my-complaints' && (
              <div className="p-4">
                <h3 className="mb-4">My Complaints</h3>
                
                {/* Dashboard Stats */}
                <div className="row mb-4">
                  <div className="col-md-3">
                    <div className="card stats-box text-center p-3">
                      <div className="stats-number display-6 fw-bold text-primary">{stats.totalComplaints}</div>
                      <div className="stats-label text-muted">Total Complaints</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card stats-box text-center p-3">
                      <div className="stats-number display-6 fw-bold text-warning">{stats.pendingComplaints}</div>
                      <div className="stats-label text-muted">Pending</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card stats-box text-center p-3">
                      <div className="stats-number display-6 fw-bold text-info">{stats.inProgressComplaints}</div>
                      <div className="stats-label text-muted">In Progress</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card stats-box text-center p-3">
                      <div className="stats-number display-6 fw-bold text-success">{stats.resolvedComplaints}</div>
                      <div className="stats-label text-muted">Resolved</div>
                    </div>
                  </div>
                </div>

                {/* Complaints List */}
                <div className="card">
                  <div className="card-body">
                    {myComplaints.length === 0 ? (
                      <p className="text-center text-muted">No complaints submitted yet.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Ticket ID</th>
                              <th>Title</th>
                              <th>Category</th>
                              <th>Priority</th>
                              <th>Status</th>
                              <th>Date</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {myComplaints.map(complaint => (
                              <tr key={complaint._id}>
                                <td>
                                  <strong>{complaint.ticketId}</strong>
                                </td>
                                <td>{complaint.title}</td>
                                <td>
                                  <span className="badge bg-secondary text-capitalize">
                                    {complaint.category}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${getPriorityBadgeClass(complaint.priority)} text-capitalize`}>
                                    {complaint.priority}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${getStatusBadgeClass(complaint.status)}`}>
                                    {complaint.status}
                                  </span>
                                </td>
                                <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleViewDetails(complaint)}
                                  >
                                    <i className="fas fa-eye me-1"></i>View Details
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="mb-0">Student Profile</h3>
                  {!showChangePassword && (
                    <Button 
                      variant="outline-primary"
                      onClick={toggleChangePassword}
                    >
                      <i className="fas fa-key me-2"></i>Change Password
                    </Button>
                  )}
                </div>
                
                <div className="row">
                  {/* Profile Information */}
                  <div className={showChangePassword ? "col-md-6" : "col-12"}>
                    <div className="card">
                      <div className="card-body">
                        {user ? (
                          <div className="row">
                            <div className="col-12">
                              <div className="mb-3">
                                <strong>Student ID:</strong> {user.studentId}
                              </div>
                              <div className="mb-3">
                                <strong>Name:</strong> {user.name}
                              </div>
                              <div className="mb-3">
                                <strong>Email:</strong> {user.email}
                              </div>
                              <div className="mb-3">
                                <strong>Mobile:</strong> {user.mobile || 'Not available'}
                              </div>
                              <div className="mb-3">
                                <strong>Room Number:</strong> {user.roomNumber}
                              </div>
                              <div className="mb-3">
                                <strong>Block:</strong> {user.block}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted">Loading user information...</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Change Password Section - Only shown when showChangePassword is true */}
                  {showChangePassword && (
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h5 className="mb-0">Change Password</h5>
                           
                        </div>
                        <div className="card-body">
                          <form onSubmit={handleChangePassword}>
                            <div className="mb-3">
                              <label className="form-label">Current Password</label>
                              <input 
                                type="password" 
                                className="form-control" 
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                disabled={passwordLoading}
                                placeholder="Enter your current password"
                              />
                            </div>
                            
                            <div className="mb-3">
                              <label className="form-label">New Password</label>
                              <input 
                                type="password" 
                                className="form-control" 
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength={6}
                                disabled={passwordLoading}
                                placeholder="Enter new password (min 6 characters)"
                              />
                              <div className="form-text">
                                Password must be at least 6 characters long.
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <label className="form-label">Confirm New Password</label>
                              <input 
                                type="password" 
                                className="form-control" 
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                disabled={passwordLoading}
                                placeholder="Confirm your new password"
                              />
                            </div>
                            
                            <div className="d-grid gap-2">
                              <button 
                                type="submit" 
                                className="btn btn-warning"
                                disabled={passwordLoading}
                              >
                                {passwordLoading ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Changing Password...
                                  </>
                                ) : (
                                  'Change Password'
                                )}
                              </button>
                              <button 
                                type="button" 
                                className="btn btn-outline-secondary"
                                onClick={toggleChangePassword}
                                disabled={passwordLoading}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complaint Details Modal */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Complaint Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <div className="complaint-details">
              <div className="row mb-3">
                <div className="col-md-6">
                  <h6>Ticket ID</h6>
                  <p className="text-muted">{selectedComplaint.ticketId}</p>
                </div>
                <div className="col-md-6">
                  <h6>Status</h6>
                  <span className={`badge ${getStatusBadgeClass(selectedComplaint.status)}`}>
                    {selectedComplaint.status}
                  </span>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <h6>Category</h6>
                  <p className="text-capitalize text-muted">{selectedComplaint.category}</p>
                </div>
                <div className="col-md-6">
                  <h6>Priority</h6>
                  <span className={`badge ${getPriorityBadgeClass(selectedComplaint.priority)}`}>
                    {selectedComplaint.priority}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <h6>Title</h6>
                <p className="text-muted">{selectedComplaint.title}</p>
              </div>

              <div className="mb-3">
                <h6>Description</h6>
                <p className="text-muted">{selectedComplaint.description || 'No description provided'}</p>
              </div>

              <div className="mb-3">
                <h6>Location</h6>
                <p className="text-muted">{selectedComplaint.location}</p>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <h6>Created Date</h6>
                  <p className="text-muted">
                    {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6>Last Updated</h6>
                  <p className="text-muted">
                    {new Date(selectedComplaint.updatedAt || selectedComplaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                <div className="mb-3">
                  <h6>Attached Images</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedComplaint.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url || image}
                        alt={`Complaint evidence ${index + 1}`}
                        className="img-thumbnail"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedComplaint.adminResponse && (
                <div className="mb-3">
                  <h6>Admin Response</h6>
                  <div className="alert alert-info">
                    <p className="mb-0">{selectedComplaint.adminResponse}</p>
                    {selectedComplaint.respondedAt && (
                      <small className="text-muted">
                        Responded on: {new Date(selectedComplaint.respondedAt).toLocaleDateString()}
                      </small>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentDashboard;