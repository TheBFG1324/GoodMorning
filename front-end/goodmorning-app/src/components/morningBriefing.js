import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';
import { useUser } from '../userContext';

const MorningBriefing = () => {
  const { user, updateUser } = useUser();
  const [message, setMessage] = useState('');

  const [briefingData, setBriefingData] = useState(null);
  const [rerenderTrigger, setRerenderTrigger] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bookRec: false,
    mindfulnessQuote: false,
    joke: false,
    vocabWord: false,
    foreignWord: '',
    news: false,
    weather: false
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const response = await axiosInstance.get(`/get-briefing/${user.googleId}`);
          setBriefingData(response.data);
        } catch (error) {
          console.error('Error fetching briefing data:', error, user);
        }
      }
    };
    fetchData();
  }, [user, rerenderTrigger]);


  const handleCustomizationUpdate = async () => {
    try {
      await axiosInstance.put(`/change-customization`, {
        googleId: user.googleId,
        customizationData: formData,
      });
      setMessage('User data updated successfully!');
      setRerenderTrigger((prev) => !prev);
      handleCloseModal(); // Close modal after successful update
    } catch (error) {
      console.error('Error updating customization:', error);
      alert('Error updating customization');
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleFormChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    handleCustomizationUpdate();
  };

  return (
    <div className='container mt-4'>
      <h1>Morning Briefing</h1>
      <div className=''>
        {briefingData ? (
          <>
            <p className=''>{briefingData.briefing}</p>
            <div className='col'>
              <button type="button" className="btn btn-large btn-primary" onClick={handleShowModal}>Customize Briefing</button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Customize Briefing</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmitForm}>
                <div className="modal-body">
                  <div className="mb-3  form-check">
                    <label htmlFor="bookRec">Book Recommendation</label>
                    <input className="form-check-input" type="checkbox" id="bookRec" name="bookRec" checked={formData.bookRec} onChange={handleFormChange} />
                  </div>
                  <div className="mb-3  form-check">
                    <label htmlFor="mindfulnessQuote">Mindfulness Quote</label>
                    <input type="checkbox" id="mindfulnessQuote" name="mindfulnessQuote" checked={formData.mindfulnessQuote} onChange={handleFormChange} />
                  </div>
                  <div className="mb-3  form-check">
                    <label htmlFor="bookRec">Joke</label>
                    <input className="form-check-input" type="checkbox" id="joke" name="joke" checked={formData.joke} onChange={handleFormChange} />
                  </div>
                  <div className="mb-3  form-check">
                    <label htmlFor="bookRec">Vocabulary Word</label>
                    <input className="form-check-input" type="checkbox" id="vocabWord" name="vocabWord" checked={formData.vocabWord} onChange={handleFormChange} />
                  </div>
                  <div className="mb-3  form-check">
                    <label htmlFor="bookRec">Foreign Word</label>
                    <input className="form-check-input" type="checkbox" id="foreignWord" name="foreignWord" checked={formData.foreignWord} onChange={handleFormChange} />
                  </div>
                  <div className="mb-3  form-check">
                    <label htmlFor="bookRec">News</label>
                    <input className="form-check-input" type="checkbox" id="news" name="news" checked={formData.news} onChange={handleFormChange} />
                  </div>
                  <div className="mb-3 form-check">
                    <label htmlFor="bookRec">Weather</label>
                    <input className="form-check-input" type="checkbox" id="weather" name="weather" checked={formData.weather} onChange={handleFormChange} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                  <button type="submit" className="btn btn-primary">Save changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MorningBriefing;

