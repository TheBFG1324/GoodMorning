import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import { useUser } from '../userContext';

const Account = () => {
  const { user, updateUser } = useUser(); 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    city: '',
  });
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        birthday: user.birthday || '',
        city: user.city || '',
      });
    } else {
      setErrorMessage('Error fetching user data.');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/update-user/${user.googleId}`, formData);
      if (response.status === 200) {
        setMessage('User data updated successfully!');
        updateUser({ ...user, ...formData });
      } else {
        setErrorMessage('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMessage('Error updating user data.');
    }
  };

  return (
    <div className='container'>
      <h1 className='mt-4'>Account Page</h1>
      {errorMessage && <p className='text-danger'>{errorMessage}</p>}
      <div className='mt-4'>
        <h2>User Data</h2>
        {user ? (
          <div>
          </div>
        ) : (
          <p>No User Data Found!</p>
        )}
      </div>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">First Name:</label>
          <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name:</label>
          <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Birthday:</label>
          <input type="date" className="form-control" name="birthday" value={formData.birthday} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">City:</label>
          <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Account;
