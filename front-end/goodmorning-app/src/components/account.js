import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Account = ({ userData }) => {
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    birthday: userData.birthday,
    city: userData.city,
  });
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        birthday: userData.birthday || '',
        city: userData.city || '',
      });
    } else {
      setErrorMessage('Error fetching user data.');
    }
  }, [userData]);

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
      const response = await axios.put(`/update-user/${userData.googleId}`, formData);
      console.log(response.data);
      // Handle success message or other logic
    } catch (error) {
      console.error('Error updating user:', error);
      // Handle error message or other logic
    }
  };

  return (
    <div>
      <h1>Account Page</h1>
      {message && <p>{message}</p>}
      <div>
        <h2>User Data</h2>
        <p>First Name: {userData.firstName}</p>
        <p>Last Name: {userData.lastName}</p>
        <p>Email: {userData.email}</p>
        <p>Birthday: {userData.birthday}</p>
        <p>City: {userData.city}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" name="firstname" value={formData.firstName} onChange={handleChange} />
        </label>
        <label>
          Last Name:
          <input type="text" name="lastname" value={formData.lastName} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
          Birthday:
          <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} />
        </label>
        <label>
          City:
          <input type="text" name="city" value={formData.city} onChange={handleChange} />
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Account;
