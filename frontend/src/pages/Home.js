import React from 'react';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import ComplaintCategories from '../components/ComplaintCategories';
import RecentComplaints from '../components/RecentComplaints';
import Statistics from '../components/Statistics';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
 
import Navbar from '../components/Navbar'

const Home = ({ onShowLoginModal, onShowRegisterModal }) => {
  return (
    <div>
       

      <div id="home">
        <HeroSection 
          onShowLoginModal={onShowLoginModal}
          onShowRegisterModal={onShowRegisterModal}
        />
      </div>
      
      <Features />
      
      <ComplaintCategories />
      
      <RecentComplaints />
      
      <div id="statistics">
        <Statistics />
      </div>
      
      <div id="faq">
        <FAQ />
      </div>
      
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
};

export default Home;







// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';

// const Dashboard = () => {
//   const { user, logout, updateProfile } = useAuth();
//   const [complaints, setComplaints] = useState([]);
//   const [stats, setStats] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [profileData, setProfileData] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     mobile: user?.mobile || ''
//   });

//   useEffect(() => {
//     if (user) {
//       fetchDashboardData();
//     }
//   }, [user]);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const [complaintsRes, statsRes] = await Promise.all([
//         axios.get(user.role === 'student' ? '/api/complaints/my-complaints' : '/api/complaints'),
//         axios.get('/api/complaints/stats')
//       ]);

//       setComplaints(complaintsRes.data.complaints || []);
//       setStats(statsRes.data);
//     } catch (err) {
//       console.error('Failed to fetch dashboard data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProfileUpdate = async (e) => {
//     e.preventDefault();
//     const result = await updateProfile(profileData);
//     if (result.success) {
//       setShowProfileModal(false);
//       alert(result.message);
//     } else {
//       alert(result.error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mt-4">
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-4">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h1>Dashboard</h1>
//           <p className="text-muted">Welcome back, {user?.name}!</p>
//         </div>
//         <div className="d-flex gap-2">
//           <button 
//             className="btn btn-outline-primary"
//             onClick={() => setShowProfileModal(true)}
//           >
//             <i className="fas fa-user-edit me-2"></i>Edit Profile
//           </button>
//           <button className="btn btn-outline-danger" onClick={logout}>
//             <i className="fas fa-sign-out-alt me-2"></i>Logout
//           </button>
//         </div>
//       </div>

//       {/* Role-specific greeting */}
//       {user?.role === 'admin' && (
//         <div className="alert alert-info">
//           <i className="fas fa-shield-alt me-2"></i>
//           You are logged in as an administrator with full system access.
//         </div>
//       )}

//       {/* Navigation Tabs */}
//       <ul className="nav nav-tabs mb-4">
//         <li className="nav-item">
//           <button 
//             className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
//             onClick={() => setActiveTab('overview')}
//           >
//             Overview
//           </button>
//         </li>
//         <li className="nav-item">
//           <button 
//             className={`nav-link ${activeTab === 'complaints' ? 'active' : ''}`}
//             onClick={() => setActiveTab('complaints')}
//           >
//             {user?.role === 'student' ? 'My Complaints' : 'All Complaints'}
//           </button>
//         </li>
//         {user?.role === 'admin' && (
//           <li className="nav-item">
//             <button 
//               className={`nav-link ${activeTab === 'management' ? 'active' : ''}`}
//               onClick={() => setActiveTab('management')}
//             >
//               Management
//             </button>
//           </li>
//         )}
//       </ul>

//       {/* Overview Tab */}
//       {activeTab === 'overview' && (
//         <div className="row">
//           <div className="col-md-3 mb-4">
//             <div className="card text-center">
//               <div className="card-body">
//                 <h3 className="text-primary">{stats.totalComplaints || 0}</h3>
//                 <p className="text-muted">Total Complaints</p>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-3 mb-4">
//             <div className="card text-center">
//               <div className="card-body">
//                 <h3 className="text-success">{stats.resolvedIssues || 0}</h3>
//                 <p className="text-muted">Resolved Issues</p>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-3 mb-4">
//             <div className="card text-center">
//               <div className="card-body">
//                 <h3 className="text-info">{stats.resolutionRate || 0}%</h3>
//                 <p className="text-muted">Resolution Rate</p>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-3 mb-4">
//             <div className="card text-center">
//               <div className="card-body">
//                 <h3 className="text-warning">{stats.avgDaysToResolve || 0}</h3>
//                 <p className="text-muted">Avg. Resolution Time (days)</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Complaints Tab */}
//       {activeTab === 'complaints' && (
//         <div className="card">
//           <div className="card-header d-flex justify-content-between align-items-center">
//             <h5 className="mb-0">{user?.role === 'student' ? 'My Complaints' : 'All Complaints'}</h5>
//             {user?.role === 'student' && (
//               <button className="btn btn-primary">
//                 <i className="fas fa-plus me-2"></i>New Complaint
//               </button>
//             )}
//           </div>
//           <div className="card-body">
//             {complaints.length === 0 ? (
//               <div className="text-center py-4">
//                 <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
//                 <p>No complaints found.</p>
//                 {user?.role === 'student' && (
//                   <button className="btn btn-primary">Submit Your First Complaint</button>
//                 )}
//               </div>
//             ) : (
//               <div className="table-responsive">
//                 <table className="table table-hover">
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Title</th>
//                       <th>Category</th>
//                       <th>Status</th>
//                       <th>Date</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {complaints.map(complaint => (
//                       <tr key={complaint._id}>
//                         <td>{complaint._id.substring(0, 8)}</td>
//                         <td>{complaint.title}</td>
//                         <td>
//                           <span className="badge bg-secondary">{complaint.category}</span>
//                         </td>
//                         <td>
//                           <span className={`badge ${
//                             complaint.status === 'resolved' ? 'bg-success' :
//                             complaint.status === 'in-progress' ? 'bg-warning' : 'bg-danger'
//                           }`}>
//                             {complaint.status}
//                           </span>
//                         </td>
//                         <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
//                         <td>
//                           <button className="btn btn-sm btn-outline-primary">
//                             <i className="fas fa-eye"></i>
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Management Tab (Admin only) */}
//       {activeTab === 'management' && user?.role === 'admin' && (
//         <div className="row">
//           <div className="col-md-6">
//             <div className="card">
//               <div className="card-header">
//                 <h5 className="mb-0">Quick Actions</h5>
//               </div>
//               <div className="card-body">
//                 <div className="d-grid gap-2">
//                   <button className="btn btn-outline-primary">
//                     <i className="fas fa-users me-2"></i>Manage Users
//                   </button>
//                   <button className="btn btn-outline-success">
//                     <i className="fas fa-chart-bar me-2"></i>View Reports
//                   </button>
//                   <button className="btn btn-outline-info">
//                     <i className="fas fa-cog me-2"></i>System Settings
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-6">
//             <div className="card">
//               <div className="card-header">
//                 <h5 className="mb-0">Recent Activity</h5>
//               </div>
//               <div className="card-body">
//                 <div className="activity-feed">
//                   <div className="activity-item">
//                     <div className="activity-content">
//                       <small className="text-muted">2 hours ago</small>
//                       <p>New complaint submitted by Student #12345</p>
//                     </div>
//                   </div>
//                   <div className="activity-item">
//                     <div className="activity-content">
//                       <small className="text-muted">5 hours ago</small>
//                       <p>Complaint #67890 was marked as resolved</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Profile Modal */}
//       {showProfileModal && (
//         <div className="modal fade show" style={{display: 'block'}}>
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Edit Profile</h5>
//                 <button type="button" className="btn-close" onClick={() => setShowProfileModal(false)}></button>
//               </div>
//               <form onSubmit={handleProfileUpdate}>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label">Full Name</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={profileData.name}
//                       onChange={(e) => setProfileData({...profileData, name: e.target.value})}
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Email</label>
//                     <input
//                       type="email"
//                       className="form-control"
//                       value={profileData.email}
//                       onChange={(e) => setProfileData({...profileData, email: e.target.value})}
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Mobile Number</label>
//                     <input
//                       type="tel"
//                       className="form-control"
//                       value={profileData.mobile}
//                       onChange={(e) => setProfileData({...profileData, mobile: e.target.value})}
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>
//                     Cancel
//                   </button>
//                   <button type="submit" className="btn btn-primary">
//                     Save Changes
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//           <div className="modal-backdrop fade show"></div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;