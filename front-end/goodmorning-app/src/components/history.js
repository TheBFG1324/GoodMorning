import React, { useState, useEffect } from 'react';
import { useUser } from '../userContext';

const HistoryComponent = () => {
  const { user } = useUser();
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          const response = await fetch(`/get-history/${user.googleId}`);
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('No history found for this user.');
            } else {
              throw new Error('Internal server error.');
            }
          }
          const data = await response.json();
          setHistoryData(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchHistory();
    }
  }, [user]);

  return (
    <div>
      <h2>History Data</h2>
      {historyData.length > 0 ? (
        <ul>
          {historyData.map((item, index) => (
            <li key={index}>
              <strong>Date:</strong> {item.date}<br />
              <strong>Instance ID:</strong> {item.instanceId}<br />
              <strong>Briefing:</strong> {item.briefing}
            </li>
          ))}
        </ul>
      ) : (
        <p>No history data available.</p>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default HistoryComponent;