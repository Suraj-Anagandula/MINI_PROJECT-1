//  import React, { useState, useEffect } from 'react';
// import { adminAPI } from '../../services/api';
// import { Modal, Button, Form } from 'react-bootstrap';

// const AdminManagement = () => {
//   const [admins, setAdmins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Modal states
//   const [showCreateModal, setShowCreateModal] = useState(false);

//   const [newAdmin, setNewAdmin] = useState({
//     name: '',
//     email: '',
//     department: '',
//     password: '',
//   });

//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   // ============================
//   // Fetch all admins
//   // ============================
//   const fetchAdmins = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const response = await adminAPI.getAllAdmins();

//       let adminsData = [];
//       if (Array.isArray(response.data)) {
//         adminsData = response.data;
//       } else if (response.data && Array.isArray(response.data.admins)) {
//         adminsData = response.data.admins;
//       } else if (response.data && Array.isArray(response.data.data)) {
//         adminsData = response.data.data;
//       } else {
//         throw new Error('Unexpected response format from server');
//       }

//       setAdmins(adminsData);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching admins:', error);
//       setError(error.response?.data?.message || error.message || 'Failed to fetch admins');
//       setLoading(false);
//     }
//   };

//   // ============================
//   // Toggle admin status
//   // ============================
//   const toggleAdminStatus = async (adminId, currentStatus) => {
//     try {
//       setError('');
//       await adminAPI.toggleAdminStatus(adminId);
//       fetchAdmins();
//       alert(`Admin ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
//     } catch (error) {
//       console.error('Error toggling admin status:', error);
//       setError(error.response?.data?.message || error.message || 'Error updating admin status.');
//     }
//   };

//   // ============================
//   // Create Admin modal
//   // ============================
//   const handleNewAdminChange = (e) => {
//     const { name, value } = e.target;
//     setNewAdmin((prev) => ({ ...prev, [name]: value }));
//   };

//   const saveNewAdmin = async () => {
//     try {
//       await adminAPI.createAdmin(newAdmin);
//       fetchAdmins();
//       setShowCreateModal(false);
//       alert('New admin created successfully!');
//     } catch (error) {
//       console.error('Error creating admin:', error);
//       setError(error.response?.data?.message || error.message || 'Failed to create admin.');
//     }
//   };

//   // ============================
//   // Loading state
//   // ============================
//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <span className="ms-2">Loading admins...</span>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2>Admin Management</h2>
//         <Button variant="primary" onClick={() => setShowCreateModal(true)}>
//           + Create Admin
//         </Button>
//       </div>

//       {error && (
//         <div className="alert alert-danger">
//           <strong>Error:</strong> {error}
//           <button className="btn btn-sm btn-outline-light ms-3" onClick={() => fetchAdmins()}>
//             Retry
//           </button>
//         </div>
//       )}

//       {/* Admins Table */}
//       <div className="card">
//         <div className="card-body">
//           {admins.length === 0 ? (
//             <div className="text-center py-4">
//               <p className="text-muted">No admins found.</p>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-striped">
//                 <thead>
//                   <tr>
//                     <th>Admin ID</th>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Department</th>
//                     <th>Status</th>
//                     <th>Permissions</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {admins.map((admin) => (
//                     <tr key={admin._id || admin.id}>
//                       <td>{admin.adminId || admin.username || 'N/A'}</td>
//                       <td>{admin.name || 'N/A'}</td>
//                       <td>{admin.email || 'N/A'}</td>
//                       <td>{admin.department || 'N/A'}</td>
//                       <td>
//                         <span className={`badge bg-${admin.isActive ? 'success' : 'danger'}`}>
//                           {admin.isActive ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>
//                       <td>
//                         <small>
//                           {admin.permissions?.canManageComplaints && 'Complaints '}
//                           {admin.permissions?.canManageUsers && 'Users '}
//                           {admin.permissions?.canManageAdmins && 'Admins'}
//                           {!admin.permissions && 'No permissions set'}
//                         </small>
//                       </td>
//                       <td>
//                         <Button
//                           size="sm"
//                           variant={admin.isActive ? 'warning' : 'success'}
//                           className="me-2"
//                           onClick={() => toggleAdminStatus(admin._id || admin.id, admin.isActive)}
//                         >
//                           {admin.isActive ? 'Deactivate' : 'Activate'}
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Create Admin Modal */}
//       <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Create New Admin</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="name"
//                 value={newAdmin.name}
//                 onChange={handleNewAdminChange}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 name="email"
//                 value={newAdmin.email}
//                 onChange={handleNewAdminChange}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Department</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="department"
//                 value={newAdmin.department}
//                 onChange={handleNewAdminChange}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="password"
//                 value={newAdmin.password}
//                 onChange={handleNewAdminChange}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={saveNewAdmin}>
//             Create
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminManagement;











import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Modal, Button, Form } from 'react-bootstrap';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    department: '',
    password: '',
  });

  useEffect(() => {
    fetchAdmins();
    // Get current user from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('Current user from localStorage:', userData);
    if (userData) {
      setCurrentUser(userData);
    }
  }, []);

  // ============================
  // Check if current user is from administration department
  // ============================
  const isAdministrationUser = () => {
    if (!currentUser) {
      console.log('No current user found');
      return false;
    }
    
    console.log('Current user role/department:', currentUser.role, currentUser.department);
    
    // Check role or department for administration
    const userRole = currentUser.role?.toLowerCase().trim();
    const userDepartment = currentUser.department?.toLowerCase().trim();
    
    const isAdmin = userRole === 'administration' || userDepartment === 'administration';
    
    console.log('Is administration user:', isAdmin);
    return isAdmin;
  };

  // ============================
  // Fetch all admins
  // ============================
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getAllAdmins();

      let adminsData = [];
      if (Array.isArray(response.data)) {
        adminsData = response.data;
      } else if (response.data && Array.isArray(response.data.admins)) {
        adminsData = response.data.admins;
      } else if (response.data && Array.isArray(response.data.data)) {
        adminsData = response.data.data;
      } else {
        throw new Error('Unexpected response format from server');
      }

      setAdmins(adminsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch admins');
      setLoading(false);
    }
  };

  // ============================
  // Toggle admin status
  // ============================
  const toggleAdminStatus = async (adminId, currentStatus) => {
    try {
      setError('');
      await adminAPI.toggleAdminStatus(adminId);
      fetchAdmins();
      alert(`Admin ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      console.error('Error toggling admin status:', error);
      setError(error.response?.data?.message || error.message || 'Error updating admin status.');
    }
  };

  // ============================
  // Create Admin modal
  // ============================
  const handleNewAdminChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const saveNewAdmin = async () => {
    try {
      await adminAPI.createAdmin(newAdmin);
      fetchAdmins();
      setShowCreateModal(false);
      alert('New admin created successfully!');
    } catch (error) {
      console.error('Error creating admin:', error);
      setError(error.response?.data?.message || error.message || 'Failed to create admin.');
    }
  };

  // ============================
  // Loading state
  // ============================
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Loading admins...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Management</h2>
        {/* Create Admin button removed */}
      </div>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
          <button className="btn btn-sm btn-outline-light ms-3" onClick={() => fetchAdmins()}>
            Retry
          </button>
        </div>
      )}

      {/* Admins Table */}
      <div className="card">
        <div className="card-body">
          {admins.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No admins found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Admin ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Permissions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin._id || admin.id}>
                      <td>{admin.adminId || admin.username || 'N/A'}</td>
                      <td>{admin.name || 'N/A'}</td>
                      <td>{admin.email || 'N/A'}</td>
                      <td>{admin.department || 'N/A'}</td>
                      <td>
                        <span className={`badge bg-${admin.isActive ? 'success' : 'danger'}`}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <small>
                          {admin.permissions?.canManageComplaints && 'Complaints '}
                          {admin.permissions?.canManageUsers && 'Users '}
                          {admin.permissions?.canManageAdmins && 'Admins'}
                          {!admin.permissions && 'No permissions set'}
                        </small>
                      </td>
                      <td>
                        {/* Show deactivate/activate button only for administration users */}
                        {isAdministrationUser() ? (
                          <Button
                            size="sm"
                            variant={admin.isActive ? 'warning' : 'success'}
                            className="me-2"
                            onClick={() => toggleAdminStatus(admin._id || admin.id, admin.isActive)}
                          >
                            {admin.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        ) : (
                          <span className="text-muted small">No actions available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Admin Modal - Keeping but not accessible via button */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newAdmin.name}
                onChange={handleNewAdminChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newAdmin.email}
                onChange={handleNewAdminChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={newAdmin.department}
                onChange={handleNewAdminChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newAdmin.password}
                onChange={handleNewAdminChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveNewAdmin}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminManagement;