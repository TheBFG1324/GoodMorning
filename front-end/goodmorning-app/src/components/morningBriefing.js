import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MorningBriefing = () => {

  const [weather, setWeather] = useState(null);
  const [wordOfTheDay, setWordOfTheDay] = useState('');

  useEffect(() => {
      const fetchWeather = async () => {
          try {
              const response = await axios.get('http://localhost:4000/api/weather');
              setWeather(response.data);
          } catch (error) {
              console.error('Error fetching weather data:', error);
          }
      };

      const fetchWordOfTheDay = async () => {
          try {
              const response = await axios.get('http://localhost:4000/api/word-of-the-day');
              setWordOfTheDay(response.data.word);
          } catch (error) {
              console.error('Error fetching word of the day:', error);
          }
      };

      fetchWeather();
      fetchWordOfTheDay();
  }, []);

    return (
        <div className='container mt-4'>
            <h1>Morning Briefing</h1>
            <div className='row'>
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Daily Weather</h5>
                    {/* Pull data in here */}
                      {weather && (
                      <div>
                        <p>Temperature: {weather.main.temp}°C</p>
                        <p>Description: {weather.weather[0].description}</p>
                        {/* Add more weather details */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Word of the Day</h5>
                    {/* Pull data in here */}
                    {wordOfTheDay && (
                      <div>
                        <p>Word: {wordOfTheDay}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title"> Foreign Word of the Day</h5>
                    {/* Pull data in here */}
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Mindfulness Quote of the Day</h5>
                    {/* Pull data in here */}
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Joke of the Day</h5>
                    {/* Pull data in here */}
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Daily News</h5>
                    {/* Pull data in here */}
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Calendar</h5>
                    {/* Pull data in here */}
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Book Recommendation</h5>
                    {/* Pull data in here */}
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
};

export default MorningBriefing;
