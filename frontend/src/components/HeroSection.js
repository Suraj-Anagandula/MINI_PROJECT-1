import React from 'react';

const HeroSection = ({ onShowLoginModal, onShowRegisterModal }) => {
  return (
    <section className="hero-section" id="home">
      <div className="container text-center">
        <h1 className="display-4 fw-bold mb-4">Hostel Care Portal</h1>
        <p className="lead mb-4">A seamless platform for students to report hostel issues and track their resolution progress</p>
        
        <div className="login-options-container">
          <h3 className="mb-4 text-white">Login</h3>
          <div className="d-flex justify-content-center gap-3 mb-4">
            <button 
              className="btn btn-light btn-lg px-4 py-2"
              onClick={() => onShowLoginModal('student')}
            >
              <i className="fas fa-user-graduate me-2"></i>I'm a Student
            </button>
            <button 
              className="btn btn-outline-light btn-lg px-4 py-2"
              onClick={() => onShowLoginModal('admin')}
            >
              <i className="fas fa-user-shield me-2"></i>I'm an Admin
            </button>
          </div>
          {/* <div className="text-center">
            <p className="text-white mb-0">Don't have an account? 
              <button 
                className="btn btn-link text-white p-0 ms-1"
                onClick={onShowRegisterModal}
              >
                <u>Register</u>
              </button>
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;