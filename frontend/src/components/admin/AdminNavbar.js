 import React from 'react';

const AdminNavbar = ({ adminData, onLogout }) => {
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">

        {/* HOME ICON BUTTON AT LEFT */}
        <button
          className="btn btn-link text-white me-2"
          style={{ fontSize: "1.3rem" }}
          onClick={() => window.location.href = '/'}
        >
          <i className="fas fa-home"></i>
        </button>

        <a className="navbar-brand" href="#">
          <i className="fas fa-hotel me-2"></i>
          Hostel Care Portal - Administration
        </a>

        <div className="ms-auto d-flex align-items-center">
          {/* SHOW ADMIN ID/NAME */}
          <span className="text-white fw-bold me-3">
            <i className="fas fa-user-shield me-2"></i>
            {adminData?.adminId || adminData?.name || 'Admin'}
          </span>
          {/* LOGOUT BUTTON */}
          <button className="btn btn-danger" onClick={onLogout}>
            <i className="fas fa-sign-out-alt me-2"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;






// import React from 'react';

// const AdminNavbar = ({ activeTab, setActiveTab, user, onLogout }) => {
  
//   // Function to get formatted department name for display
//   const getDepartmentDisplayName = () => {
//     // Use the department from props first
//     const department = user?.department;
    
//     if (!department) {
//       // Fallback to localStorage if user prop doesn't have department
//       try {
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//           const userData = JSON.parse(storedUser);
//           return formatDepartmentName(userData?.department);
//         }
//       } catch (error) {
//         console.error('Error reading user from localStorage:', error);
//       }
//       return 'Admin';
//     }
    
//     return formatDepartmentName(department);
//   };

//   // Format department name for proper display
//   const formatDepartmentName = (dept) => {
//     if (!dept) return 'Admin';
    
//     return dept
//       .toLowerCase()
//       .split(' ')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   };

//   const displayDepartment = getDepartmentDisplayName();

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//       <div className="container-fluid">

//         {/* HOME ICON BUTTON AT LEFT */}
//         <button
//           className="btn btn-link text-white me-2"
//           style={{ fontSize: "1.3rem" }}
//           onClick={() => window.location.href = '/'}
//         >
//           <i className="fas fa-home"></i>
//         </button>

//         <a className="navbar-brand" href="#">
//           <i className="fas fa-hotel me-2"></i>
//           Hostel Care Portal - {displayDepartment} Department
//         </a>

//         <div className="ms-auto d-flex align-items-center">
//           {/* SHOW ADMIN ID/NAME */}
//           <span className="text-white fw-bold me-3">
//             <i className="fas fa-user-shield me-2"></i>
//             {  displayDepartment || 'Admin'}
//           </span>
//           {/* LOGOUT BUTTON */}
//           <button className="btn btn-danger" onClick={onLogout}>
//             <i className="fas fa-sign-out-alt me-2"></i>
//             Logout
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default AdminNavbar;

