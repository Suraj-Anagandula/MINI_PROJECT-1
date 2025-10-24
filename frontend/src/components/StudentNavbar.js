import React from 'react';




const StudentNavbar = ({ activeTab, setActiveTab, user, onLogout }) => {
  
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
          Hostel Care Portal - Student Dashboard
        </a>

        <div className="ms-auto d-flex align-items-center">
          {/* SHOW STUDENT ID */}
          <span className="text-white fw-bold me-3">
            {user?.studentId || 'Student'}
          </span>
          {/* LOGOUT BUTTON */}
          <button className="btn btn-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
