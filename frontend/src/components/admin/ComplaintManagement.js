import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all'
  });

  useEffect(() => {
    fetchComplaints();
  }, [currentPage, filters]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = { 
        page: currentPage, 
        limit: 10,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.category !== 'all' && { category: filters.category })
      };

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setComplaints(response.data.complaints);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/complaints/${complaintId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the specific complaint in the state with the new status
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => 
          complaint._id === complaintId 
            ? { ...complaint, status: newStatus } 
            : complaint
        )
      );
      
      alert('Complaint status updated successfully!');
    } catch (error) {
      console.error('Error updating complaint status:', error);
      alert('Error updating complaint status. Please try again.');
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
      <h2 className="mb-4">Complaint Management</h2>
      
      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <select 
            className="form-select"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="col-md-4">
          <select 
            className="form-select"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="all">All Categories</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="carpentry">Carpentry</option>
            <option value="internet">Internet</option>
            <option value="sanitation">Sanitation</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="col-md-4">
          <button 
            className="btn btn-secondary w-100"
            onClick={() => setFilters({ status: 'all', category: 'all' })}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(complaint => (
                  <tr key={complaint._id}>
                    <td>{complaint.ticketId}</td>
                    <td>{complaint.title}</td>
                    <td>
                      <span className="badge bg-secondary text-capitalize">{complaint.category}</span>
                    </td>
                    <td>{complaint.student?.name} ({complaint.student?.studentId})</td>
                    <td>
                      <span className={`badge bg-${
                        complaint.status === 'resolved' ? 'success' : 
                        complaint.status === 'pending' ? 'warning' : 
                        complaint.status === 'rejected' ? 'danger' : 'info'
                      }`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select 
                        className="form-select form-select-sm"
                        value={complaint.status}
                        onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(page)}>
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintManagement;
