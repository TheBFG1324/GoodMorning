import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../userContext';

const Account = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    googleId: '',
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
        googleId: user.googleId || '',
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
      const response = await axios.put(`/update-user/${user.googleId}`, formData);
      console.log(response.data);
      setMessage('User data updated successfully!');
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
            <p>Google ID: {user.googleId}</p>
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>
            <p>Email: {user.email}</p>
            <p>Birthday: {user.birthday}</p>
            <p>City: {user.city}</p>
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
