 import React from 'react';

const ComplaintCategories = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Common Complaint Categories</h2>
          <p className="text-muted">We handle various types of hostel maintenance issues</p>
        </div>
        <div className="row g-4">
          <div className="col-md-3 col-6">
            <div className="card text-center p-4">
              <div className="display-4 mb-3">💨</div>
              <h5>Fans</h5>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card text-center p-4">
              <div className="display-4 mb-3">💡</div>
              <h5>Lighting</h5>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card text-center p-4">
              <div className="display-4 mb-3">🔌</div>
              <h5>Sockets & Ports</h5>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card text-center p-4">
              <div className="display-4 mb-3">🧹</div>
              <h5>Sanitation</h5>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card text-center p-4">
              <div className="display-4 mb-3">🛜</div>
              <h5>Internet</h5>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card text-center p-4">
              <div className="display-4 mb-3">🪟</div>
              <h5>Doors & Windows</h5>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card text-center p-4">
              <div className="display-4 mb-3">🛏️</div>
              <h5>Furniture</h5>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card text-center p-4">
              <div className="display-4 mb-3">💧</div>
              <h5>Water Supply</h5>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplaintCategories;