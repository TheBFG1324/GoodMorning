import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
          const response = await axios.get(`/get-briefing/${user.googleId}`);
          setBriefingData(response.data);
        } catch (error) {
          console.error('Error fetching briefing data:', error);
          // For testing purposes, set default data
          setBriefingData({
            firstName: 'John',
            lastName: 'Doe',
            city: 'Lawrence',
            weather: '75',
            vocabWord: 'Serendipity',
            foreignWord: 'Bonjour',
            mindfulnessQuote: 'Be present in the moment.',
            joke: 'Why was the math book sad? Because it had too many problems.',
            news: 'Breaking news: New discovery in space.',
            bookRec: 'The Alchemist by Paulo Coelho',
          });
        }
      }
    };

    fetchData();
  }, [user, rerenderTrigger]);


  const handleCustomizationUpdate = async () => {
    try {
      await axios.put(`/change-customization`, {
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
      <div className='row row-cols-1 row-cols-md-2 g-4'>
        {briefingData ? (
          <>
            <div className='col'>
                <div className=''>
                  <h5 className=''>Hello {briefingData.firstName} {briefingData.lastName} from {briefingData.city}</h5>
                </div>
            </div>
            <div className='col'>
            </div>
            <div className='col'>
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>Daily Weather</h5>
                  <p className='card-text'>Temperature: {briefingData.weather}°F</p>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>Word of the Day</h5>
                  <p className='card-text'>{briefingData.vocabWord}</p>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>Foreign Word of the Day</h5>
                  <p className='card-text'>{briefingData.foreignWord}</p>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>Mindfulness Quote of the Day</h5>
                  <p className='card-text'>{briefingData.mindfulnessQuote}</p>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>Joke of the Day</h5>
                  <p className='card-text'>Need a laugh: {briefingData.joke}</p>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>Daily News</h5>
                  <p className='card-text'>Today's Headlines: {briefingData.news}</p>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>Book Recommendation</h5>
                  <p className='card-text'>Here's your next read: {briefingData.bookRec}</p>
                </div>
              </div>
            </div>
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

