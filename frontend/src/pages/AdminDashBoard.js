 






import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/admin/AdminNavbar';
import DashboardOverview from '../components/admin/DashboardOverview';
import ComplaintManagement from '../components/admin/ComplaintManagement';
import UserManagement from '../components/admin/UserManagement';
import AdminManagement from '../components/admin/AdminManagement';
import Analytics from '../components/admin/Analytics';
import { Modal, Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { authAPI } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Admin Registration Modal States
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [step, setStep] = useState('register');
  const [formData, setFormData] = useState({
    adminId: '',
    name: '',
    department: 'administration', // Set default department as administration
    email: '',
    adminPassword: '',
    adminConfirmPassword: '',
    phone: '',
    otp: ''
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    fetchAdminData();
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminData(response.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    window.location.href = '/login';
  };

  // Admin Registration Functions
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

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setError('');
    setMessage('');

    try {
      const { adminId, name, department, email, adminPassword, adminConfirmPassword, phone } = formData;

      if (adminPassword !== adminConfirmPassword) {
        setError('Passwords do not match');
        setRegisterLoading(false);
        return;
      }

      if (adminPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        setRegisterLoading(false);
        return;
      }

      const response = await authAPI.adminRegister({
        adminId,
        name,
        department,
        email,
        password: adminPassword,
        phone
      });

      // Set userId and move to verification step
      setUserId(response.data.adminId);
      setStep('verify');
      setMessage('Verification OTP sent to the admin email address');
      startCountdown();

    } catch (error) {
      console.error('Admin registration error:', error);
      if (error.response?.data?.errors) {
        setError(error.response.data.errors[0].msg);
      } else {
        setError(error.response?.data?.message || 'Admin registration failed. Please try again.');
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setError('');

    try {
      const response = await authAPI.verifyOTP({
        userId,
        userType: 'admin',
        otp: formData.otp
      });

      // Success case - show success message
      setMessage('Admin account created successfully!');
      setError('');
      
      setTimeout(() => {
        resetRegisterForm();
        setShowRegisterModal(false);
        // Refresh the admin list if we're on the admins tab
        if (activeTab === 'admins') {
          // You can add a refresh function here if needed
        }
      }, 2000);

    } catch (error) {
      console.error('OTP verification error:', error);
      
      if (error.response?.status === 200) {
        setMessage('Admin account created successfully!');
        setError('');
        
        setTimeout(() => {
          resetRegisterForm();
          setShowRegisterModal(false);
        }, 2000);
      } 
      else if (error.response?.data?.errors) {
        setError(error.response.data.errors[0].msg);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('OTP verification failed. Please try again.');
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setRegisterLoading(true);
    setError('');

    try {
      await authAPI.resendOTP({
        userId,
        userType: 'admin'
      });

      setMessage('New OTP sent to the admin email address');
      startCountdown();
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError(error.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setRegisterLoading(false);
    }
  };

  const resetRegisterForm = () => {
    setStep('register');
    setFormData({
      adminId: '',
      name: '',
      department: 'administration', // Reset to default department
      email: '',
      adminPassword: '',
      adminConfirmPassword: '',
      phone: '',
      otp: ''
    });
    setError('');
    setMessage('');
    setUserId('');
    setCountdown(0);
  };

  const handleCloseRegisterModal = () => {
    resetRegisterForm();
    setShowRegisterModal(false);
  };

  const renderRegistrationForm = () => (
    <Form onSubmit={handleAdminRegister}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Admin ID *</Form.Label>
            <Form.Control
              type="text"
              name="adminId"
              value={formData.adminId}
              onChange={handleInputChange}
              placeholder="Enter admin ID"
              required
              disabled={registerLoading}
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
              placeholder="Enter full name"
              required
              disabled={registerLoading}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Department field as hidden since it's always 'administration' */}
      <Form.Group className="mb-3">
        <Form.Label>Department</Form.Label>
        <Form.Control
          type="text"
          value="Administration"
          disabled
          readOnly
        />
        <Form.Text className="text-muted">
          All admins are assigned to the Administration department
        </Form.Text>
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              disabled={registerLoading}
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
              placeholder="Enter email address"
              required
              disabled={registerLoading}
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
              name="adminPassword"
              value={formData.adminPassword}
              onChange={handleInputChange}
              placeholder="Create a password (min 6 characters)"
              required
              disabled={registerLoading}
              minLength={6}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password *</Form.Label>
            <Form.Control
              type="password"
              name="adminConfirmPassword"
              value={formData.adminConfirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
              disabled={registerLoading}
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-grid">
        <Button 
          variant="primary" 
          type="submit" 
          disabled={registerLoading}
          size="lg"
        >
          {registerLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Creating Admin...
            </>
          ) : (
            'Create Admin Account'
          )}
        </Button>
      </div>
    </Form>
  );

  const renderVerificationForm = () => (
    <Form onSubmit={handleVerifyOTP}>
      <div className="text-center mb-4">
        <i className="fas fa-envelope fa-3x text-primary mb-3"></i>
        <h4>Verify Admin Email</h4>
        <p className="text-muted">
          We've sent a 6-digit verification code to the admin's email address.
          Please enter it below to complete the registration.
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
          disabled={registerLoading}
          maxLength={6}
          pattern="[0-9]{6}"
          inputMode="numeric"
        />
        <Form.Text className="text-muted">
          Enter the 6-digit code sent to the admin's email
        </Form.Text>
      </Form.Group>

      <div className="d-grid gap-2">
        <Button 
          variant="primary" 
          type="submit" 
          disabled={registerLoading || formData.otp.length !== 6}
          size="lg"
        >
          {registerLoading ? (
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
            'Verify Admin Account'
          )}
        </Button>
        
        <Button 
          variant="outline-secondary" 
          onClick={handleResendOTP}
          disabled={countdown > 0 || registerLoading}
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

  const renderContent = () => {
    if (loading && activeTab === 'dashboard') {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview stats={stats} />;
      case 'complaints':
        return <ComplaintManagement />;
      case 'users':
        return <UserManagement />;
      case 'admins':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3></h3>
              <Button 
                variant="primary" 
                onClick={() => setShowRegisterModal(true)}
                className="d-flex align-items-center"
              >
                <i className="fas fa-plus me-2"></i>
                Create New Admin
              </Button>
            </div>
            <AdminManagement />
          </div>
        );
      case 'analytics':
        return <Analytics />;
      default:
        return <DashboardOverview stats={stats} />;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminNavbar adminData={adminData} onLogout={handleLogout} />
      
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2 sidebar bg-dark text-white p-0">
            <div className="d-flex flex-column p-3 vh-100">
              <h5 className="text-center mb-4 text-white">Admin Panel</h5>
              <div className="nav flex-column nav-pills">
                <button 
                  className={`nav-link text-white text-start mb-2 ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                </button>
                <button 
                  className={`nav-link text-white text-start mb-2 ${activeTab === 'complaints' ? 'active' : ''}`}
                  onClick={() => setActiveTab('complaints')}
                >
                  <i className="fas fa-list me-2"></i>Complaints
                </button>
                <button 
                  className={`nav-link text-white text-start mb-2 ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  <i className="fas fa-users me-2"></i>Users
                </button>
                <button 
                  className={`nav-link text-white text-start mb-2 ${activeTab === 'admins' ? 'active' : ''}`}
                  onClick={() => setActiveTab('admins')}
                >
                  <i className="fas fa-user-shield me-2"></i>Admins
                </button>
                <button 
                  className={`nav-link text-white text-start mb-2 ${activeTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  <i className="fas fa-chart-bar me-2"></i>Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 col-lg-10 main-content p-4">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Admin Registration Modal */}
      <Modal show={showRegisterModal} onHide={handleCloseRegisterModal} centered backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {step === 'register' ? 'Create New Admin' : 'Verify Admin Email'}
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
              <Button 
                variant="link" 
                onClick={handleCloseRegisterModal}
                className="text-decoration-none"
              >
                <i className="fas fa-arrow-left me-1"></i>
                Back to Admin Management
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboard;