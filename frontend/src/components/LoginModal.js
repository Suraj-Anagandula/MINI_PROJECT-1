 

// import React, { useState, useEffect } from 'react';
// import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
// import { authAPI } from '../services/api';
// import { useAuth } from '../context/AuthContext';

// const LoginModal = ({ show, onHide, loginType, onShowForgotPassword, onShowRegister }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     rememberMe: false
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const { login } = useAuth();

//   // Reset form when modal is shown/hidden
//   useEffect(() => {
//     if (show) {
//       setFormData({
//         username: '',
//         password: '',
//         rememberMe: false
//       });
//       setError('');
//     }
//   }, [show]);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       let response;
//       if (loginType === 'student') {
//         response = await authAPI.studentLogin({
//           studentId: formData.username,
//           password: formData.password
//         });
//       } else {
//         response = await authAPI.adminLogin({
//           adminId: formData.username,
//           password: formData.password
//         });
//       }

//       const { token, user, admin } = response.data;
//       const userData = user || admin;
//       const userType = user ? 'student' : 'admin';

//       login(userData, token, userType, formData.rememberMe);
//       onHide();
      
//       // Hide the main navbar by adding a class to body or setting a flag
//       document.body.classList.add('user-logged-in');
      
//       // Redirect based on user type
//       window.location.href = userType === 'student' 
//         ? '/student-dashboard' 
//         : '/admin-dashboard';
      
//     } catch (error) {
//       console.error('Login error:', error);
//       setError(
//         error.response?.data?.message || 
//         error.response?.data?.error || 
//         'Login failed. Please check your credentials and try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} centered backdrop="static">
//       <Modal.Header closeButton>
//         <Modal.Title>{loginType === 'student' ? 'Student' : 'Admin'} Login</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {error && <Alert variant="danger">{error}</Alert>}
        
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>
//               {loginType === 'student' ? 'Student ID' : 'Admin ID'}
//             </Form.Label>
//             <Form.Control
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleInputChange}
//               placeholder={`Enter your ${loginType === 'student' ? 'student' : 'admin'} ID`}
//               required
//               disabled={loading}
//               autoComplete="username"
//             />
//           </Form.Group>
          
//           <Form.Group className="mb-3">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               placeholder="Enter your password"
//               required
//               disabled={loading}
//               autoComplete="current-password"
//             />
//           </Form.Group>
          
//           <Form.Group className="mb-3">
//             <Form.Check
//               type="checkbox"
//               name="rememberMe"
//               label="Remember me"
//               checked={formData.rememberMe}
//               onChange={handleInputChange}
//               disabled={loading}
//             />
//           </Form.Group>
          
//           <div className="d-grid">
//             <Button 
//               variant="primary" 
//               type="submit" 
//               disabled={loading}
//               size="lg"
//             >
//               {loading ? (
//                 <>
//                   <Spinner
//                     as="span"
//                     animation="border"
//                     size="sm"
//                     role="status"
//                     aria-hidden="true"
//                     className="me-2"
//                   />
//                   Logging in...
//                 </>
//               ) : (
//                 'Login'
//               )}
//             </Button>
//           </div>
//         </Form>
        
//         <div className="text-center mt-3">
//           <Button 
//             variant="link" 
//             onClick={onShowForgotPassword}
//             className="text-decoration-none p-0"
//           >
//             Forgot Password?
//           </Button>
//         </div>
        
//         <hr />
        
//         <div className="text-center">
//           <p className="mb-0">
//             Don't have an account?{' '}
//             <Button 
//               variant="link" 
//               onClick={onShowRegister}
//               className="text-decoration-none p-0"
//             >
//               Register here
//             </Button>
//           </p>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default LoginModal;




import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ show, onHide, loginType, onShowForgotPassword, onShowRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  // Reset form when modal is shown/hidden
  useEffect(() => {
    if (show) {
      setFormData({
        username: '',
        password: '',
        rememberMe: false
      });
      setError('');
    }
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (loginType === 'student') {
        response = await authAPI.studentLogin({
          studentId: formData.username,
          password: formData.password
        });
      } else {
        response = await authAPI.adminLogin({
          adminId: formData.username,
          password: formData.password
        });
      }

      const { token, user, admin } = response.data;
      const userData = user || admin;
      const userType = user ? 'student' : 'admin';

      login(userData, token, userType, formData.rememberMe);
      onHide();
      
      // Hide the main navbar by adding a class to body or setting a flag
      document.body.classList.add('user-logged-in');
      
      // Redirect based on user type
      window.location.href = userType === 'student' 
        ? '/student-dashboard' 
        : '/admin-dashboard';
      
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{loginType === 'student' ? 'Student' : 'Admin'} Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              {loginType === 'student' ? 'Student ID' : 'Admin ID'}
            </Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={`Enter your ${loginType === 'student' ? 'student' : 'admin'} ID`}
              required
              disabled={loading}
              autoComplete="username"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="rememberMe"
              label="Remember me"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Form.Group>
          
          <div className="d-grid">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </div>
        </Form>
        
        <div className="text-center mt-3">
          <Button 
            variant="link" 
            onClick={onShowForgotPassword}
            className="text-decoration-none p-0"
          >
            Forgot Password?
          </Button>
        </div>
        
        {/* Only show register option for student login */}
        {loginType === 'student' && (
          <>
            <hr />
            <div className="text-center">
              <p className="mb-0">
                Don't have an account?{' '}
                <Button 
                  variant="link" 
                  onClick={onShowRegister}
                  className="text-decoration-none p-0"
                >
                  Register here
                </Button>
              </p>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
