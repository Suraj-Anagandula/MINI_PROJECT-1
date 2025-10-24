 






import React, { useState } from 'react';
import { authAPI } from '../services/api';

const ForgotPasswordModal = ({ show, onHide }) => {
  const [step, setStep] = useState('email'); // Steps: email → otp → reset
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [countdown, setCountdown] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 1️⃣ Step 1: Send OTP to Email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authAPI.forgotPassword({ email: formData.email });
      setUserId(response.data.userId);
      setMessage('OTP has been sent to your registered email.');
      setStep('otp');
      startCountdown();
    } catch (error) {
      console.error('Send OTP error:', error);
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Step 2: Verify OTP for Password Reset
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use the new password reset OTP verification endpoint
      const response = await authAPI.verifyPasswordResetOTP({
        userId: userId,
        otp: formData.otp
      });
      
      setMessage('OTP verified successfully. Please reset your password.');
      setStep('reset');
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.resetPassword({
        userId: userId,
        newPassword: formData.newPassword
      });

      setMessage('Password reset successfully! You can now login with your new password.');
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setLoading(true);
    setError('');
    try {
      // For password reset, we need to call forgotPassword again to resend OTP
      await authAPI.forgotPassword({ email: formData.email });
      setMessage('New OTP sent to your email.');
      startCountdown();
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError(error.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setFormData({
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setMessage('');
    setUserId('');
    setCountdown(0);
    onHide();
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {step === 'email'
                ? 'Forgot Password'
                : step === 'otp'
                ? 'Verify OTP'
                : 'Reset Password'}
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            {/* Step 1: Email Input */}
            {step === 'email' && (
              <form onSubmit={handleSendOTP}>
                <p className="text-muted mb-3">
                  Enter your registered email address to receive an OTP for password reset.
                </p>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your registered email"
                    required
                    disabled={loading}
                  />
                </div>
                <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP}>
                <p className="text-muted mb-3">
                  Enter the 6-digit OTP sent to <strong>{formData.email}</strong>.
                </p>
                <div className="mb-3">
                  <label htmlFor="otp" className="form-label">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    disabled={loading}
                  />
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || formData.otp.length !== 6}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Verifying...
                      </>
                    ) : (
                      'Verify OTP'
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || loading}
                  >
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                  </button>

                  <button
                    type="button"
                    className="btn btn-link text-decoration-none"
                    onClick={() => setStep('email')}
                    disabled={loading}
                  >
                    ← Back to Email
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 'reset' && (
              <form onSubmit={handleResetPassword}>
                <p className="text-muted mb-3">Create your new password below.</p>

                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password (min 6 characters)"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <div className="form-text">Password must be at least 6 characters long</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Resetting Password...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setStep('otp')}
                    disabled={loading}
                  >
                    ← Back to OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;