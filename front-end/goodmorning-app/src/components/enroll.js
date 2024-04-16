import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../axios';
import { useUser } from '../userContext';
import { GoogleLogin } from 'react-google-login';
import { jwtDecode } from "jwt-decode";

// Callback function on successful login
const responseGoogle = (response) => {
  console.log('Success:', response);
  const decodedToken = jwtDecode(response.credential)
        const email = decodedToken.email
        const googleId = CryptoJS.SHA256(decodedToken.sub).toString();
  // You can now use the response.tokenObj.access_token to make requests to your backend
}

// Callback function on login failure
const handleFailure = (error) => {
  console.error('Failed to login:', error);
}



const EnrollUserForm = ({ updateMorningBriefing }) => {
  const { updateUser } = useUser();
  const [user, setUser] = useState({
    googleId: '',
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    city: '',
    customization: {
      bookRec: false,
      mindfulnessQuote: false,
      joke: false,
      vocabWord: false,
      foreignWord: false,
      news: false,
      weather: false,
    },
  });
  const [enrolled, setEnrolled] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/enroll-user', { user });
      console.log(response.data); // handle success response here
      setEnrolled(true);
      updateUser(user); // Update user data in context
      updateMorningBriefing(user); // Pass user data to updateMorningBriefing function
    } catch (error) {
      console.error('Error enrolling user:', error);
    }
  };

  return (
    <div className='container'>

<div>
      <GoogleLogin
        clientId="77518070221-18nm814qe2a6hf0b6gfo2pnv64762d1o.apps.googleusercontent.com" // Replace with your Google Client ID
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={handleFailure}
        cookiePolicy={'single_host_origin'}
      />
    </div>
      <h1 className='mt-4'>Enroll Page</h1>
      <div className="mt-4">
        <form className='mt-4' onSubmit={handleSubmit}>
        <div className="mb-3">
            <label className='form-label' htmlFor="googleId">Google ID:</label>
            <input
                type="text"
                className="form-control"
                id="googleId"
                name="googleId"
                value={user.googleId}
                onChange={handleChange}
            />
        </div>
        <div className="mb-3">
            <label className='form-label' htmlFor="firstName">First Name:</label>
            <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
            />
        </div>
        <div className="mb-3">
            <label className='form-label' htmlFor="lastName">Last Name:</label>
            <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
            />
        </div>
        <div className="mb-3">
            <label className='form-label' htmlFor="email">Email:</label>
            <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
            />
        </div>
        <div className="mb-3">
            <label className='form-label' htmlFor="birthday">Birthday:</label>
            <input
                type="date"
                className="form-control"
                id="birthday"
                name="birthday"
                value={user.birthday}
                onChange={handleChange}
            />
        </div>
        <div className="mb-3">
            <label className='form-label' htmlFor="city">City:</label>
            <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                value={user.city}
                onChange={handleChange}
            />
        </div>
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id="bookRec"
                name="customization.bookRec"
                checked={user.customization.bookRec}
                onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="bookRec">
                Book Recommendation
            </label>
        </div>
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id="mindfulnessQuote"
                name="customization.mindfulnessQuote"
                checked={user.customization.mindfulnessQuote}
                onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="mindfulnessQuote">
                Mindfulness Quote
            </label>
        </div>
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id="joke"
                name="customization.joke"
                checked={user.customization.joke}
                onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="joke">
                Joke
            </label>
        </div>
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id="vocabWord"
                name="customization.vocabWord"
                checked={user.customization.vocabWord}
                onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="vocabWord">
                Vocabulary Word
            </label>
        </div>
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id="foreignWord"
                name="customization.foreignWord"
                checked={user.customization.foreignWord}
                onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="foreignWord">
                Foreign Word
            </label>
        </div>
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id="news"
                name="customization.news"
                checked={user.customization.news}
                onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="news">
                News
            </label>
        </div>
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id="weather"
                name="customization.weather"
                checked={user.customization.weather}
                onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="weather">
                Weather
            </label>
        </div>
        <div className='text-center'>
          <button type="submit" className="btn btn-large btn-primary">Sign up</button>
        </div>
    </form>
      </div>

  </div>
);

};

export default EnrollUserForm;
