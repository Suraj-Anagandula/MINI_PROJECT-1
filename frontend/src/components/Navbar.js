import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onShowLoginModal, currentPage, setCurrentPage }) => {
  const { isAuthenticated } = useAuth();

  // Scroll to element with offset for sticky navbar. Retry a few times if element is not yet in DOM.
  const scrollToSection = (id) => {
    const attemptScroll = (retries = 6) => {
      const el = document.getElementById(id);
      if (el) {
        // compute offset (use actual navbar height if available)
        const navbarEl = document.querySelector('.navbar');
        const offset = (navbarEl && navbarEl.offsetHeight) ? navbarEl.offsetHeight : 70;
        const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        return;
      }
      if (retries > 0) {
        // retry after short delay (useful if section mounts after click)
        setTimeout(() => attemptScroll(retries - 1), 100);
      }
    };

    attemptScroll();
  };

  const handleNavClick = (page, e) => {
    if (e) e.preventDefault();
    setCurrentPage && setCurrentPage(page);
    // Try to scroll immediately
    scrollToSection(page);
  };

  // Don't render navbar if user is authenticated (keeps your existing behavior)
  if (isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container">
        <a
          className="navbar-brand"
          href="#home"
          onClick={(e) => handleNavClick('home', e)}
        >
          <i className="fas fa-hotel me-2"></i>Hostel Care Portal
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                href="#home"
                onClick={(e) => handleNavClick('home', e)}
              >
                Home
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link ${currentPage === 'statistics' ? 'active' : ''}`}
                href="#statistics"
                onClick={(e) => handleNavClick('statistics', e)}
              >
                Statistics
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link ${currentPage === 'faq' ? 'active' : ''}`}
                href="#faq"
                onClick={(e) => handleNavClick('faq', e)}
              >
                FAQ
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
                href="#contact"
                onClick={(e) => handleNavClick('contact', e)}
              >
                Contact
              </a>
            </li>
          </ul>

          {/* Login / Admin Login buttons intentionally removed per request */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
