// // src/context/AuthContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [loading, setLoading] = useState(true);

//   // Set auth token in axios headers
//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       // Verify token and get user data on app load
//       verifyToken();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   const verifyToken = async () => {
//     try {
//       const res = await axios.get('/api/auth/verify');
//       setUser(res.data.user);
//     } catch (err) {
//       console.error('Token verification failed:', err);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (formData, userType) => {
//     setLoading(true);
//     try {
//       const endpoint = userType === 'student' ? '/api/auth/student/login' : '/api/auth/admin/login';
//       const res = await axios.post(endpoint, formData);
      
//       const { token: newToken, user: userData } = res.data;
//       setToken(newToken);
//       setUser(userData);
//       localStorage.setItem('token', newToken);
      
//       axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
//       return { success: true };
//     } catch (err) {
//       const error = err.response?.data?.message || 'Login failed';
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (formData, userType) => {
//     setLoading(true);
//     try {
//       const endpoint = userType === 'student' ? '/api/auth/student/register' : '/api/auth/admin/register';
//       const res = await axios.post(endpoint, formData);
      
//       if (userType === 'student') {
//         // For students, we might get a token immediately
//         if (res.data.token) {
//           const { token: newToken, user: userData } = res.data;
//           setToken(newToken);
//           setUser(userData);
//           localStorage.setItem('token', newToken);
//           axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
//         }
//         return { success: true, message: 'Registration successful! Please verify your mobile number.' };
//       } else {
//         // For admin, registration might require approval
//         return { success: true, message: 'Registration request submitted! Your account will be activated after verification.' };
//       }
//     } catch (err) {
//       const error = err.response?.data?.message || 'Registration failed';
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['Authorization'];
//   };

//   const forgotPassword = async (formData) => {
//     setLoading(true);
//     try {
//       await axios.post('/api/auth/forgot-password', formData);
//       return { success: true, message: 'OTP has been sent to your registered mobile number.' };
//     } catch (err) {
//       const error = err.response?.data?.message || 'Failed to process request';
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetPassword = async (formData) => {
//     setLoading(true);
//     try {
//       await axios.post('/api/auth/reset-password', formData);
//       return { success: true, message: 'Password reset successfully. You can now login with your new password.' };
//     } catch (err) {
//       const error = err.response?.data?.message || 'Failed to reset password';
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProfile = async (formData) => {
//     setLoading(true);
//     try {
//       const res = await axios.put('/api/users/profile', formData);
//       setUser(res.data.user);
//       return { success: true, message: 'Profile updated successfully!' };
//     } catch (err) {
//       const error = err.response?.data?.message || 'Failed to update profile';
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     login,
//     register,
//     logout,
//     forgotPassword,
//     resetPassword,
//     updateProfile
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };




// src/context/AuthContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [loading, setLoading] = useState(true);

//   // Set auth token in axios headers
//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       verifyToken();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   const verifyToken = async () => {
//     try {
//       const res = await axios.get('/api/auth/me');
//       if (res.data.userType === 'student') {
//         setUser({
//           id: res.data.user._id,
//           name: res.data.user.name,
//           email: res.data.user.email,
//           studentId: res.data.user.studentId,
//           roomNumber: res.data.user.roomNumber,
//           block: res.data.user.block,
//           role: 'student'
//         });
//       } else {
//         setUser({
//           id: res.data.user._id,
//           name: res.data.user.name,
//           email: res.data.user.email,
//           adminId: res.data.user.adminId,
//           department: res.data.user.department,
//           role: 'admin'
//         });
//       }
//     } catch (err) {
//       console.error('Token verification failed:', err);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (formData, userType) => {
//     setLoading(true);
//     try {
//       const endpoint = userType === 'student' 
//         ? '/api/auth/student/login' 
//         : '/api/auth/admin/login';
      
//       const res = await axios.post(endpoint, formData);
      
//       const { token: newToken } = res.data;
//       const userData = userType === 'student' ? res.data.user : res.data.admin;
      
//       setToken(newToken);
//       setUser({
//         ...userData,
//         role: userType
//       });
//       localStorage.setItem('token', newToken);
      
//       axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
//       return { success: true };
//     } catch (err) {
//       const error = err.response?.data?.message || 'Login failed';
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (formData, userType) => {
//     setLoading(true);
//     try {
//       const endpoint = userType === 'student' 
//         ? '/api/auth/student/register' 
//         : '/api/auth/admin/register';
      
//       const res = await axios.post(endpoint, formData);
      
//       if (userType === 'student') {
//         return { 
//           success: true, 
//           message: 'Registration successful. Please verify your account with OTP.',
//           userId: res.data.userId
//         };
//       } else {
//         return { 
//           success: true, 
//           message: 'Registration request submitted! Your account will be activated after verification.' 
//         };
//       }
//     } catch (err) {
//       const error = err.response?.data?.message || 'Registration failed';
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOTP = async (userId, otp) => {
//     setLoading(true);
//     try {
//       await axios.post('/api/auth/verify-otp', { userId, otp });
//       return { success: true, message: 'Account verified successfully' };
//     } catch (err) {
//       const error = err.response?.data?.message || 'OTP verification failed';
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const forgotPassword = async (formData) => {
//     setLoading(true);
//     try {
//       const res = await axios.post('/api/auth/forgot-password', formData);
//       return { 
//         success: true, 
//         message: 'OTP has been sent to your registered mobile number.',
//         userId: res.data.userId
//       };
//     } catch (err) {
//       const error = err.response?.data?.message || 'Failed to process request';
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetPassword = async (userId, otp, newPassword) => {
//     setLoading(true);
//     try {
//       await axios.post('/api/auth/reset-password', { 
//         userId, 
//         otp, 
//         newPassword 
//       });
//       return { success: true, message: 'Password reset successfully' };
//     } catch (err) {
//       const error = err.response?.data?.message || 'Failed to reset password';
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['Authorization'];
//   };

//   const updateProfile = async (formData) => {
//     setLoading(true);
//     try {
//       const res = await axios.put('/api/users/profile', formData);
//       setUser(prev => ({ ...prev, ...res.data.user }));
//       return { success: true, message: 'Profile updated successfully!' };
//     } catch (err) {
//       const error = err.response?.data?.message || 'Failed to update profile';
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     login,
//     register,
//     verifyOTP,
//     logout,
//     forgotPassword,
//     resetPassword,
//     updateProfile
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType);
      
      // Verify token is still valid
      authAPI.verifyToken()
        .catch(() => {
          logout();
        });
    }
    
    setLoading(false);
  }, []);

  const login = (userData, token, type) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', type);
    setUser(userData);
    setUserType(type);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    setUser(null);
    setUserType(null);
  };

  const value = {
    user,
    userType,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};