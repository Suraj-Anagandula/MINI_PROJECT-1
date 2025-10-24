// import React, { useState } from 'react';
// import { Modal, Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
// import { authAPI } from '../services/api';

// const RegisterModal = ({ show, onHide, onShowLogin }) => {
//   const [registerType, setRegisterType] = useState(''); // 'student' or 'admin'
//   const [step, setStep] = useState('register'); // 'register' or 'verify'
//   const [formData, setFormData] = useState({
//     // Student registration fields
//     studentId: '',
//     name: '',
//     mobile: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     roomNumber: '',
//     block: '',
    
//     // Admin registration fields
//     adminId: '',
//     name: '',
//     department: '',
//     email: '',
//     adminPassword: '',
//     adminConfirmPassword: '',
//     phone: '',

//     // OTP field
//     otp: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const [userId, setUserId] = useState('');
//   const [countdown, setCountdown] = useState(0);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const startCountdown = () => {
//     setCountdown(60);
//     const timer = setInterval(() => {
//       setCountdown(prev => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setMessage('');

//     try {
//       if (registerType === 'student') {
//         const { studentId, name, mobile, email, password, confirmPassword, roomNumber, block } = formData;

//         if (password !== confirmPassword) {
//           setError('Passwords do not match');
//           setLoading(false);
//           return;
//         }

//         if (password.length < 6) {
//           setError('Password must be at least 6 characters long');
//           setLoading(false);
//           return;
//         }

//         const response = await authAPI.studentRegister({
//           studentId,
//           name,
//           mobile,
//           email,
//           password,
//           roomNumber,
//           block
//         });

//         // Set userId and move to verification step
//         setUserId(response.data.userId);
//         setStep('verify');
//         setMessage('Verification OTP sent to your email address');
//         startCountdown();

//       } else if (registerType === 'admin') {
//         const { adminId, name, department, email, adminPassword, adminConfirmPassword, phone } = formData;

//         if (adminPassword !== adminConfirmPassword) {
//           setError('Passwords do not match');
//           setLoading(false);
//           return;
//         }

//         if (adminPassword.length < 6) {
//           setError('Password must be at least 6 characters long');
//           setLoading(false);
//           return;
//         }

//         const response = await authAPI.adminRegister({
//           adminId,
//           name,
//           department,
//           email,
//           password: adminPassword,
//           phone
//         });

//         // Set userId and move to verification step
//         setUserId(response.data.adminId);
//         setStep('verify');
//         setMessage('Verification OTP sent to your email address');
//         startCountdown();
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
//       if (error.response?.data?.errors) {
//         setError(error.response.data.errors[0].msg);
//       } else {
//         setError(error.response?.data?.message || 'Registration failed. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await authAPI.verifyOTP({
//         userId,
//         userType: registerType,
//         otp: formData.otp
//       });

//       // Success case - show success message
//       setMessage('Account verified successfully! You can now login.');
//       setError('');
      
//       setTimeout(() => {
//         resetForm();
//         onHide();
//         onShowLogin();
//       }, 2000);

//     } catch (error) {
//       console.error('OTP verification error:', error);
      
//       // Check if this is actually a successful response with parsing issues
//       if (error.response?.status === 200) {
//         setMessage('Account verified successfully! You can now login.');
//         setError('');
        
//         setTimeout(() => {
//           resetForm();
//           onHide();
//           onShowLogin();
//         }, 2000);
//       } 
//       // Handle actual errors
//       else if (error.response?.data?.errors) {
//         setError(error.response.data.errors[0].msg);
//       } else if (error.response?.data?.message) {
//         setError(error.response.data.message);
//       } else {
//         setError('OTP verification failed. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     if (countdown > 0) return;

//     setLoading(true);
//     setError('');

//     try {
//       await authAPI.resendOTP({
//         userId,
//         userType: registerType
//       });

//       setMessage('New OTP sent to your email address');
//       startCountdown();
//     } catch (error) {
//       console.error('Resend OTP error:', error);
//       setError(error.response?.data?.message || 'Failed to resend OTP.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setRegisterType('');
//     setStep('register');
//     setFormData({
//       studentId: '',
//       name: '',
//       mobile: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       roomNumber: '',
//       block: '',
//       adminId: '',
//       name: '',
//       department: '',
//       email: '',
//       adminPassword: '',
//       adminConfirmPassword: '',
//       phone: '',
//       otp: ''
//     });
//     setError('');
//     setMessage('');
//     setUserId('');
//     setCountdown(0);
//   };

//   const handleClose = () => {
//     resetForm();
//     onHide();
//   };

//   const renderRegistrationForm = () => {
//     if (registerType === 'student') {
//       return (
//         <Form onSubmit={handleRegister}>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Student ID *</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="studentId"
//                   value={formData.studentId}
//                   onChange={handleInputChange}
//                   placeholder="Enter your student ID"
//                   required
//                   disabled={loading}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Full Name *</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   placeholder="Enter your full name"
//                   required
//                   disabled={loading}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Mobile Number *</Form.Label>
//                 <Form.Control
//                   type="tel"
//                   name="mobile"
//                   value={formData.mobile}
//                   onChange={handleInputChange}
//                   placeholder="Enter your mobile number"
//                   required
//                   disabled={loading}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Email Address *</Form.Label>
//                 <Form.Control
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter your email address"
//                   required
//                   disabled={loading}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Room Number *</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="roomNumber"
//                   value={formData.roomNumber}
//                   onChange={handleInputChange}
//                   placeholder="e.g., 205"
//                   required
//                   disabled={loading}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Block *</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="block"
//                   value={formData.block}
//                   onChange={handleInputChange}
//                   placeholder="e.g., B"
//                   required
//                   disabled={loading}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Password *</Form.Label>
//                 <Form.Control
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder="Create a password (min 6 characters)"
//                   required
//                   disabled={loading}
//                   minLength={6}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Confirm Password *</Form.Label>
//                 <Form.Control
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                   placeholder="Confirm your password"
//                   required
//                   disabled={loading}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

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
//                   Registering...
//                 </>
//               ) : (
//                 'Register as Student'
//               )}
//             </Button>
//           </div>
//         </Form>
//       );
//     } else {
//       return (
//         <Form onSubmit={handleRegister}>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Admin ID *</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="adminId"
//                   value={formData.adminId}
//                   onChange={handleInputChange}
//                   placeholder="Enter admin ID"
//                   required
//                   disabled={loading}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Full Name *</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   placeholder="Enter full name"
//                   required
//                   disabled={loading}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Form.Group className="mb-3">
//             <Form.Label>Department *</Form.Label>
//             <Form.Select
//               name="department"
//               value={formData.department}
//               onChange={handleInputChange}
//               required
//               disabled={loading}
//             >
//               <option value="">Select Department</option>
//               <option value="maintenance">Maintenance</option>
//               <option value="electrical">Electrical</option>
//               <option value="plumbing">Plumbing</option>
//               <option value="sanitation">Sanitation</option>
//               <option value="administration">Administration</option>
//               <option value="internet">Internet</option>
//               <option value="carpentry">Carpentry</option>
//             </Form.Select>
//           </Form.Group>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Phone Number</Form.Label>
//                 <Form.Control
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   placeholder="Enter phone number"
//                   disabled={loading}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Email Address *</Form.Label>
//                 <Form.Control
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter email address"
//                   required
//                   disabled={loading}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Password *</Form.Label>
//                 <Form.Control
//                   type="password"
//                   name="adminPassword"
//                   value={formData.adminPassword}
//                   onChange={handleInputChange}
//                   placeholder="Create a password (min 6 characters)"
//                   required
//                   disabled={loading}
//                   minLength={6}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Confirm Password *</Form.Label>
//                 <Form.Control
//                   type="password"
//                   name="adminConfirmPassword"
//                   value={formData.adminConfirmPassword}
//                   onChange={handleInputChange}
//                   placeholder="Confirm your password"
//                   required
//                   disabled={loading}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

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
//                   Registering...
//                 </>
//               ) : (
//                 'Register as Admin'
//               )}
//             </Button>
//           </div>
//         </Form>
//       );
//     }
//   };

//   const renderVerificationForm = () => (
//     <Form onSubmit={handleVerifyOTP}>
//       <div className="text-center mb-4">
//         <i className="fas fa-envelope fa-3x text-primary mb-3"></i>
//         <h4>Verify Your Email</h4>
//         <p className="text-muted">
//           We've sent a 6-digit verification code to your email address.
//           Please enter it below to complete your registration.
//         </p>
//       </div>

//       <Form.Group className="mb-3">
//         <Form.Label>Verification Code</Form.Label>
//         <Form.Control
//           type="text"
//           name="otp"
//           value={formData.otp}
//           onChange={handleInputChange}
//           placeholder="Enter 6-digit code"
//           required
//           disabled={loading}
//           maxLength={6}
//           pattern="[0-9]{6}"
//           inputMode="numeric"
//         />
//         <Form.Text className="text-muted">
//           Enter the 6-digit code sent to your email
//         </Form.Text>
//       </Form.Group>

//       <div className="d-grid gap-2">
//         <Button 
//           variant="primary" 
//           type="submit" 
//           disabled={loading || formData.otp.length !== 6}
//           size="lg"
//         >
//           {loading ? (
//             <>
//               <Spinner
//                 as="span"
//                 animation="border"
//                 size="sm"
//                 role="status"
//                 aria-hidden="true"
//                 className="me-2"
//               />
//               Verifying...
//             </>
//           ) : (
//             'Verify Account'
//           )}
//         </Button>
        
//         <Button 
//           variant="outline-secondary" 
//           onClick={handleResendOTP}
//           disabled={countdown > 0 || loading}
//         >
//           {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
//         </Button>

//         <Button 
//           variant="link" 
//           onClick={() => setStep('register')}
//           className="text-decoration-none"
//         >
//           <i className="fas fa-arrow-left me-1"></i>
//           Back to registration
//         </Button>
//       </div>
//     </Form>
//   );

//   return (
//     <Modal show={show} onHide={handleClose} centered backdrop="static" size={registerType ? 'lg' : 'md'}>
//       <Modal.Header closeButton>
//         <Modal.Title>
//           {step === 'register' ? 
//             (!registerType ? 'Create Account' : 
//              registerType === 'student' ? 'Student Registration' : 'Admin Registration') :
//             'Verify Your Email'
//           }
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
//         {message && <Alert variant="success">{message}</Alert>}

//         {step === 'register' ? (
//           !registerType ? (
//             <div className="text-center">
//               <h5 className="mb-4">Select Account Type</h5>
//               <div className="d-flex flex-column gap-3">
//                 <Button 
//                   variant="primary" 
//                   size="lg" 
//                   onClick={() => setRegisterType('student')}
//                   className="py-3"
//                 >
//                   <i className="fas fa-user-graduate me-2"></i>
//                   I'm a Student
//                 </Button>
//                 <Button 
//                   variant="outline-primary" 
//                   size="lg" 
//                   onClick={() => setRegisterType('admin')}
//                   className="py-3"
//                 >
//                   <i className="fas fa-user-shield me-2"></i>
//                   I'm an Admin
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             renderRegistrationForm()
//           )
//         ) : (
//           renderVerificationForm()
//         )}

//         {step === 'register' && registerType && (
//           <div className="text-center mt-3">
//             <Button 
//               variant="link" 
//               onClick={() => setRegisterType('')}
//               className="text-decoration-none"
//             >
//               <i className="fas fa-arrow-left me-1"></i>
//               Back to account selection
//             </Button>
//           </div>
//         )}

//         {step === 'register' && (
//           <hr />
//         )}

//         {step === 'register' && (
//           <div className="text-center">
//             <p className="mb-0">
//               Already have an account?{' '}
//               <Button 
//                 variant="link" 
//                 onClick={() => {
//                   resetForm();
//                   onShowLogin();
//                 }}
//                 className="text-decoration-none p-0"
//               >
//                 Login here
//               </Button>
//             </p>
//           </div>
//         )}
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default RegisterModal;









import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { authAPI } from '../services/api';

const RegisterModal = ({ show, onHide, onShowLogin }) => {
  const [step, setStep] = useState('register'); // 'register' or 'verify'
  const [formData, setFormData] = useState({
    // Student registration fields
    studentId: '',
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    roomNumber: '',
    block: '',
    
    // OTP field
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [countdown, setCountdown] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { studentId, name, mobile, email, password, confirmPassword, roomNumber, block } = formData;

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      const response = await authAPI.studentRegister({
        studentId,
        name,
        mobile,
        email,
        password,
        roomNumber,
        block
      });

      // Set userId and move to verification step
      setUserId(response.data.userId);
      setStep('verify');
      setMessage('Verification OTP sent to your email address');
      startCountdown();

    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.errors) {
        setError(error.response.data.errors[0].msg);
      } else {
        setError(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.verifyOTP({
        userId,
        userType: 'student',
        otp: formData.otp
      });

      // Success case - show success message
      setMessage('Account verified successfully! You can now login.');
      setError('');
      
      setTimeout(() => {
        resetForm();
        onHide();
        onShowLogin();
      }, 2000);

    } catch (error) {
      console.error('OTP verification error:', error);
      
      // Check if this is actually a successful response with parsing issues
      if (error.response?.status === 200) {
        setMessage('Account verified successfully! You can now login.');
        setError('');
        
        setTimeout(() => {
          resetForm();
          onHide();
          onShowLogin();
        }, 2000);
      } 
      // Handle actual errors
      else if (error.response?.data?.errors) {
        setError(error.response.data.errors[0].msg);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('OTP verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setError('');

    try {
      await authAPI.resendOTP({
        userId,
        userType: 'student'
      });

      setMessage('New OTP sent to your email address');
      startCountdown();
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError(error.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('register');
    setFormData({
      studentId: '',
      name: '',
      mobile: '',
      email: '',
      password: '',
      confirmPassword: '',
      roomNumber: '',
      block: '',
      otp: ''
    });
    setError('');
    setMessage('');
    setUserId('');
    setCountdown(0);
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const renderRegistrationForm = () => {
    return (
      <Form onSubmit={handleRegister}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Student ID *</Form.Label>
              <Form.Control
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder="Enter your student ID"
                required
                disabled={loading}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Mobile Number *</Form.Label>
              <Form.Control
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Enter your mobile number"
                required
                disabled={loading}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Room Number *</Form.Label>
              <Form.Control
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleInputChange}
                placeholder="e.g., 205"
                required
                disabled={loading}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Block *</Form.Label>
              <Form.Control
                type="text"
                name="block"
                value={formData.block}
                onChange={handleInputChange}
                placeholder="e.g., B"
                required
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Password *</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password (min 6 characters)"
                required
                disabled={loading}
                minLength={6}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password *</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>

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
                Registering...
              </>
            ) : (
              'Register as Student'
            )}
          </Button>
        </div>
      </Form>
    );
  };

  const renderVerificationForm = () => (
    <Form onSubmit={handleVerifyOTP}>
      <div className="text-center mb-4">
        <i className="fas fa-envelope fa-3x text-primary mb-3"></i>
        <h4>Verify Your Email</h4>
        <p className="text-muted">
          We've sent a 6-digit verification code to your email address.
          Please enter it below to complete your registration.
        </p>
      </div>

      <Form.Group className="mb-3">
        <Form.Label>Verification Code</Form.Label>
        <Form.Control
          type="text"
          name="otp"
          value={formData.otp}
          onChange={handleInputChange}
          placeholder="Enter 6-digit code"
          required
          disabled={loading}
          maxLength={6}
          pattern="[0-9]{6}"
          inputMode="numeric"
        />
        <Form.Text className="text-muted">
          Enter the 6-digit code sent to your email
        </Form.Text>
      </Form.Group>

      <div className="d-grid gap-2">
        <Button 
          variant="primary" 
          type="submit" 
          disabled={loading || formData.otp.length !== 6}
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
              Verifying...
            </>
          ) : (
            'Verify Account'
          )}
        </Button>
        
        <Button 
          variant="outline-secondary" 
          onClick={handleResendOTP}
          disabled={countdown > 0 || loading}
        >
          {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
        </Button>

        <Button 
          variant="link" 
          onClick={() => setStep('register')}
          className="text-decoration-none"
        >
          <i className="fas fa-arrow-left me-1"></i>
          Back to registration
        </Button>
      </div>
    </Form>
  );

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {step === 'register' ? 'Student Registration' : 'Verify Your Email'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        {step === 'register' ? (
          renderRegistrationForm()
        ) : (
          renderVerificationForm()
        )}

        {step === 'register' && (
          <div className="text-center mt-3">
            <hr />
            <p className="mb-0">
              Already have an account?{' '}
              <Button 
                variant="link" 
                onClick={() => {
                  resetForm();
                  onShowLogin();
                }}
                className="text-decoration-none p-0"
              >
                Login here
              </Button>
            </p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;