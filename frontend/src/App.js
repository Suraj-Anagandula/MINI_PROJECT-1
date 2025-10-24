// import React, { useState } from 'react';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import StudentDashboard from './pages/StudentDashBoard'
// import LoginModal from './components/LoginModal';
// import RegisterModal from './components/RegisterModal';
// import ForgotPasswordModal from './components/ForgotPasswordModal';
// import './App.css';

// function App() {
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showRegisterModal, setShowRegisterModal] = useState(false);
//   const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
//   const [loginType, setLoginType] = useState('');
//   const [currentPage, setCurrentPage] = useState('home');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userType, setUserType] = useState('');

//   const handleCloseLoginModal = () => {
//     setShowLoginModal(false);
//     setLoginType('');
//   };

//   const handleShowLoginModal = (type) => {
//     setLoginType(type);
//     setShowLoginModal(true);
//   };

//   const handleCloseRegisterModal = () => {
//     setShowRegisterModal(false);
//   };

//   const handleShowRegisterModal = () => {
//     setShowRegisterModal(true);
//   };

//   const handleCloseForgotPasswordModal = () => setShowForgotPasswordModal(false);
  
//   const handleShowForgotPasswordModal = () => {
//     handleCloseLoginModal();
//     setShowForgotPasswordModal(true);
//   };

//   const handleLoginSuccess = (type) => {
//     setIsLoggedIn(true);
//     setUserType(type);
//     setCurrentPage(type === 'student' ? 'student-dashboard' : 'admin-dashboard');
//     handleCloseLoginModal();
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUserType('');
//     setCurrentPage('home');
//   };

//   const renderPage = () => {
//     switch(currentPage) {
//       case 'home':
//         return <Home 
//           onShowLoginModal={handleShowLoginModal}
//           onShowRegisterModal={handleShowRegisterModal}
//         />;
//       case 'student-dashboard':
//         return <StudentDashboard />;
//       // Add admin-dashboard case later
//       default:
//         return <Home 
//           onShowLoginModal={handleShowLoginModal}
//           onShowRegisterModal={handleShowRegisterModal}
//         />;
//     }
//   };

//   return (
//     <div className="App">
//       {!isLoggedIn ? (
//         <Navbar 
//           onShowLoginModal={handleShowLoginModal}
//           currentPage={currentPage}
//           setCurrentPage={setCurrentPage}
//         />
//       ) : null}
      
//       {renderPage()}

//       <LoginModal 
//         show={showLoginModal}
//         onHide={handleCloseLoginModal}
//         loginType={loginType}
//         onShowForgotPassword={handleShowForgotPasswordModal}
//         onShowRegister={handleShowRegisterModal}
//         onLoginSuccess={handleLoginSuccess}
//       />

//       <RegisterModal 
//         show={showRegisterModal}
//         onHide={handleCloseRegisterModal}
//         onShowLogin={() => {
//           handleCloseRegisterModal();
//           handleShowLoginModal('student');
//         }}
//       />

//       <ForgotPasswordModal 
//         show={showForgotPasswordModal}
//         onHide={handleCloseForgotPasswordModal}
//       />
//     </div>
//   );
// }

// export default App;


// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import StudentDashboard from './pages/StudentDashBoard';
// import AdminDashboard from './pages/AdminDashBoard';
// import LoginModal from './components/LoginModal';
// import RegisterModal from './components/RegisterModal';
// import ForgotPasswordModal from './components/ForgotPasswordModal';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import './App.css';

// // Protected Route Component
// const ProtectedRoute = ({ children, requiredRole }) => {
//   const { user, userType, loading } = useAuth();
  
//   if (loading) {
//     return <div className="loading-spinner">Loading...</div>;
//   }
  
//   if (!user) {
//     return <Navigate to="/" replace />;
//   }
  
//   if (requiredRole && userType !== requiredRole) {
//     return <Navigate to="/" replace />;
//   }
  
//   return children;
// };

// function AppContent() {
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showRegisterModal, setShowRegisterModal] = useState(false);
//   const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
//   const [loginType, setLoginType] = useState('');
//   const { user, userType, logout } = useAuth();

//   const handleCloseLoginModal = () => {
//     setShowLoginModal(false);
//     setLoginType('');
//   };

//   const handleShowLoginModal = (type) => {
//     setLoginType(type);
//     setShowLoginModal(true);
//   };

//   const handleCloseRegisterModal = () => {
//     setShowRegisterModal(false);
//   };

//   const handleShowRegisterModal = () => {
//     setShowRegisterModal(true);
//   };

//   const handleCloseForgotPasswordModal = () => setShowForgotPasswordModal(false);
  
//   const handleShowForgotPasswordModal = () => {
//     handleCloseLoginModal();
//     setShowForgotPasswordModal(true);
//   };

//   return (
//     <div className="App">
//       <Navbar 
//         onShowLoginModal={handleShowLoginModal}
//         onShowRegisterModal={handleShowRegisterModal}
//       />
      
//       <Routes>
//         <Route path="/" element={<Home 
//           onShowLoginModal={handleShowLoginModal}
//           onShowRegisterModal={handleShowRegisterModal}
//         />} />
        
//         <Route path="/student-dashboard" element={
//           <ProtectedRoute requiredRole="student">
//             <StudentDashboard />
//           </ProtectedRoute>
//         } />
        
//         <Route path="/admin-dashboard" element={
//           <ProtectedRoute requiredRole="admin">
//             <AdminDashboard />
//           </ProtectedRoute>
//         } />
        
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>

//       <LoginModal 
//         show={showLoginModal}
//         onHide={handleCloseLoginModal}
//         loginType={loginType}
//         onShowForgotPassword={handleShowForgotPasswordModal}
//         onShowRegister={handleShowRegisterModal}
//       />

//       <RegisterModal 
//         show={showRegisterModal}
//         onHide={handleCloseRegisterModal}
//         onShowLogin={() => {
//           handleCloseRegisterModal();
//           handleShowLoginModal('student');
//         }}
//       />

//       <ForgotPasswordModal 
//         show={showForgotPasswordModal}
//         onHide={handleCloseForgotPasswordModal}
//       />
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <AppContent />
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;



import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudentDashboard from './pages/StudentDashBoard';
import AdminDashboard from './pages/AdminDashBoard';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, userType, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && userType !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Custom hook to check if we're on a dashboard route
const useIsDashboardRoute = () => {
  const location = useLocation();
  return location.pathname.includes('-dashboard');
};

function AppContent() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [loginType, setLoginType] = useState('');
  const { user, userType, logout } = useAuth();
  const isDashboardRoute = useIsDashboardRoute();

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    setLoginType('');
  };

  const handleShowLoginModal = (type) => {
    setLoginType(type);
    setShowLoginModal(true);
  };

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
  };

  const handleShowRegisterModal = () => {
    setShowRegisterModal(true);
  };

  const handleCloseForgotPasswordModal = () => setShowForgotPasswordModal(false);
  
  const handleShowForgotPasswordModal = () => {
    handleCloseLoginModal();
    setShowForgotPasswordModal(true);
  };

  // Determine if navbar should be shown
  const shouldShowNavbar = !isDashboardRoute && !user;

  return (
    <div className="App">
      {shouldShowNavbar && (
        <Navbar 
          onShowLoginModal={handleShowLoginModal}
          onShowRegisterModal={handleShowRegisterModal}
        />
      )}
      
      <Routes>
        <Route path="/" element={<Home 
          onShowLoginModal={handleShowLoginModal}
          onShowRegisterModal={handleShowRegisterModal}
        />} />
        
        <Route path="/student-dashboard" element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin-dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <LoginModal 
        show={showLoginModal}
        onHide={handleCloseLoginModal}
        loginType={loginType}
        onShowForgotPassword={handleShowForgotPasswordModal}
        onShowRegister={handleShowRegisterModal}
      />

      <RegisterModal 
        show={showRegisterModal}
        onHide={handleCloseRegisterModal}
        onShowLogin={() => {
          handleCloseRegisterModal();
          handleShowLoginModal('student');
        }}
      />

      <ForgotPasswordModal 
        show={showForgotPasswordModal}
        onHide={handleCloseForgotPasswordModal}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;