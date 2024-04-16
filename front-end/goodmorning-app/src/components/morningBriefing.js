import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../axios';
import { useUser } from '../userContext';

const MorningBriefing = () => {
  const { user } = useUser();
  const [briefingData, setBriefingData] = useState(null);
  const [rerenderTrigger, setRerenderTrigger] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bookRec: true,
    mindfulnessQuote: true,
    joke: true,
    vocabWord: true,
    foreignWord: true,
    news: true,
    weather: true
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const response = await axiosInstance.get(`/get-briefing/${user.googleId}`);
          setBriefingData(response.data);
        } catch (error) {
          console.error('Error fetching briefing data:', error);
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
      alert('Customization updated successfully');
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            <p className=''>{briefingData}</p>
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
                  <div className="mb-3">
                    <label htmlFor="bookRec">Book Recommendation</label>
                    <input type="checkbox" id="bookRec" name="bookRec" checked={formData.bookRec} onChange={handleFormChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mindfulnessQuote">Mindfulness Quote</label>
                    <input type="checkbox" id="mindfulnessQuote" name="mindfulnessQuote" checked={formData.mindfulnessQuote} onChange={handleFormChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bookRec">Joke</label>
                    <input type="checkbox" id="joke" name="joke" checked={formData.joke} onChange={handleFormChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bookRec">Vocabulary Word</label>
                    <input type="checkbox" id="vocabWord" name="vocabWord" checked={formData.vocabWord} onChange={handleFormChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bookRec">Foreign Word</label>
                    <input type="checkbox" id="foreignWord" name="foreignWord" checked={formData.foreignWord} onChange={handleFormChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bookRec">News</label>
                    <input type="checkbox" id="news" name="news" checked={formData.news} onChange={handleFormChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bookRec">Weather</label>
                    <input type="checkbox" id="weather" name="weather" checked={formData.weather} onChange={handleFormChange} />
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

