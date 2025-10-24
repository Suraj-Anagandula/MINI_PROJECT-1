import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/users`, {
        headers: { 
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json'
        },
        params: { 
          page: currentPage, 
          limit: 10, 
          search: searchTerm 
        }
      });

      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setTotalUsers(response.data.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please check your connection and try again.');
      setLoading(false);

      if (error.response) {
        setError(`Error: ${error.response.status} - ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
        setError('Network error. Please check if the server is running.');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user and all their complaints?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${process.env.REACT_APP_API_URL}/admin/users/${userId}`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined }
        });
        fetchUsers();
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/users/${userId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      });
      setSelectedUser(response.data);
      setShowUserModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Error loading user details');
    }
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Loading users...</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">User Management</h2>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchUsers}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card bg-light">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-center">
                  <h3 className="text-primary mb-0">{totalUsers}</h3>
                  <p className="text-muted mb-0">Total Registered Users</p>
                </div>
                <div className="col-md-4 text-center">
                  <h3 className="text-info mb-0">{users.length}</h3>
                  <p className="text-muted mb-0">Users on this page</p>
                </div>
                <div className="col-md-4 text-center">
                  <h3 className="text-success mb-0">{totalPages}</h3>
                  <p className="text-muted mb-0">Total Pages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search users by name, student ID, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="btn btn-outline-secondary" 
              type="button"
              onClick={() => setSearchTerm('')}
              disabled={!searchTerm}
            >
              <i className="fas fa-times me-1"></i>Clear
            </button>
          </div>
        </div>
        <div className="col-md-4 text-end">
          <button 
            className="btn btn-outline-primary"
            onClick={fetchUsers}
          >
            <i className="fas fa-sync-alt me-1"></i>Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            <i className="fas fa-users me-2"></i>
            Registered Users
            {searchTerm && ` - Search results for "${searchTerm}"`}
          </h5>
        </div>
        <div className="card-body">
          {users.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <p className="text-muted">
                {searchTerm ? 'No users found matching your search.' : 'No users registered yet.'}
              </p>
              {searchTerm && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Room</th>
                    <th>Block</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{(currentPage - 1) * 10 + index + 1}</td>
                      <td><strong>{user.studentId}</strong></td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile || 'N/A'}</td>
                      <td>{user.roomNumber || 'N/A'}</td>
                      <td>{user.block || 'N/A'}</td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString()}
                        <br />
                        <small className="text-muted">
                          {new Date(user.createdAt).toLocaleTimeString()}
                        </small>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-info btn-sm me-1"
                            onClick={() => handleViewUser(user._id)}
                            title="View User Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteUser(user._id)}
                            title="Delete User"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="User pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left me-1"></i>Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next<i className="fas fa-chevron-right ms-1"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">User Details - {selectedUser.user.studentId}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeUserModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>User Information</h6>
                    <p><strong>Name:</strong> {selectedUser.user.name}</p>
                    <p><strong>Email:</strong> {selectedUser.user.email}</p>
                    <p><strong>Mobile:</strong> {selectedUser.user.mobile || 'N/A'}</p>
                    <p><strong>Room:</strong> {selectedUser.user.roomNumber || 'N/A'}</p>
                    <p><strong>Block:</strong> {selectedUser.user.block || 'N/A'}</p>
                    <p><strong>Registered:</strong> {new Date(selectedUser.user.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Complaint Statistics</h6>
                    <p><strong>Total Complaints:</strong> {selectedUser.complaints.length}</p>
                    {selectedUser.complaints.length > 0 && (
                      <>
                        <p><strong>Recent Complaints:</strong></p>
                        <div className="list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {selectedUser.complaints.map(complaint => (
                            <div key={complaint._id} className="list-group-item">
                              <div className="d-flex justify-content-between">
                                <span>{complaint.title}</span>
                                <span className={`badge ${
                                  complaint.status === 'resolved' ? 'bg-success' : 
                                  complaint.status === 'in-progress' ? 'bg-info' : 'bg-warning'
                                }`}>
                                  {complaint.status}
                                </span>
                              </div>
                              <small className="text-muted">
                                {complaint.ticketId} • {new Date(complaint.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeUserModal}>
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

export default UserManagement;
