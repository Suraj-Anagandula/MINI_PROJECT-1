import React from 'react';

const Features = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">How It Works</h2>
          <p className="text-muted">Simple steps to get your hostel issues resolved</p>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 text-center p-4">
              <div className="feature-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <h4>1. Register & Login</h4>
              <p className="text-muted">Create your account using your student ID and verify with OTP</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 text-center p-4">
              <div className="feature-icon">
                <i className="fas fa-tools"></i>
              </div>
              <h4>2. Report Issue</h4>
              <p className="text-muted">Submit detailed complaints with photos or videos of the problem</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 text-center p-4">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h4>3. Track Progress</h4>
              <p className="text-muted">Monitor the status of your complaints and receive updates</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;