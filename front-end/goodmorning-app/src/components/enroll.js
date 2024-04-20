import React, { useState } from 'react';
import axiosInstance from '../axios';
import { useUser } from '../userContext';

const EnrollUserForm = ({ updateMorningBriefing }) => {
  const { updateUser } = useUser();
  const [user, setUser] = useState({
    googleId: '',
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    city: '',
  });
  const [ customization, setCustomization ] = useState({
    bookRec: false,
    mindfulnessQuote: false,
    joke: false,
    vocabWord: false,
    foreignWord: '',
    news: false,
    weather: false,
  })
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    if (name.startsWith('customization.')) {
      const key = name.split('.')[1];
      setCustomization((prevCustomization) => ({
        ...prevCustomization,
        [key]: type === 'checkbox' ? checked : value,
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/enroll-user', { user, customization });
      setEnrolled(true);
      updateUser({ ...user, customization });
      setMessage('User enrolled successfully!');
    } catch (error) {
      console.error('Error enrolling user:', error);
      setErrorMessage('Error enrolling user.');
    }
  };

  return (
    <div className='container'>

    <div>
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
                checked={customization.bookRec}
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
                checked={customization.mindfulnessQuote}
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
                checked={customization.joke}
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
                checked={customization.vocabWord}
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
                checked={customization.foreignWord}
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
                checked={customization.news}
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
                checked={customization.weather}
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
