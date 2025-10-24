 




import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container">

                   <div className="row">
          <div className="col-md-4 mb-4">
            <h5><i className="fas fa-hotel me-2"></i>Hostel Care Portal</h5>
            <p>A platform for students to report and track hostel maintenance issues efficiently.</p>
          </div>
          <div className="col-md-2 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-white">Home</a></li>
              <li><a href="#statistics" className="text-white">Statistics</a></li>
              <li><a href="#faq" className="text-white">FAQ</a></li>
              <li><a href="#contact" className="text-white">Contact</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h5>Contact Info</h5>
            <ul className="list-unstyled">
              <li><i className="fas fa-map-marker-alt me-2"></i> College Campus, Hostel Block</li>
              <li><i className="fas fa-phone me-2"></i> +91 9876543210</li>
              <li><i className="fas fa-envelope me-2"></i> support@hostelcare.edu</li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h5>Follow Us</h5>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
              <a href="#" className="text-white"><i className="fab fa-twitter fa-lg"></i></a>
              <a href="#" className="text-white"><i className="fab fa-instagram fa-lg"></i></a>
              <a href="#" className="text-white"><i className="fab fa-linkedin-in fa-lg"></i></a>
            </div>
          </div>
        </div>
        <hr className="bg-light" />
        <div className="text-center py-3">
          <p className="mb-0">&copy; 2023 Hostel Care Portal. All rights reserved.</p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;