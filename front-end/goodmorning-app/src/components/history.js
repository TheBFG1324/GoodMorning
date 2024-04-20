import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import { useUser } from '../userContext';

const HistoryComponent = () => {
  const { user } = useUser();
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          const response = await axiosInstance.get(`/get-history/${user.googleId}`);
          if (!response.ok) {
            console.log("Error fetching: ", error);
          }
          const data = await response.data;
          setHistoryData(response.data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchHistory();
    }
  }, [user]);

  return (
    <div>
      <h2 className='mt-4'>History Data</h2>
      {historyData.length > 0 ? (
        <ul className='list-group'>
          {historyData.map((item, index) => (
            <li key={index} className="list-group-item">
              <strong>Instance: </strong> {item.instanceId}<br />
              <strong>Date:</strong> {item.date}<br />
              <strong>Briefing:</strong> {item.briefing}<br />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3">No history data available.</p>
      )}
      {error && <p className="text-danger mt-3">Error: {error}</p>}
    </div>
    
  );
};

export default HistoryComponent;