import React, { useState } from 'react';
import './App.css';

function App() {
  const [ticketId, setTicketId] = useState('');
  const [ticketData, setTicketData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ticketId.trim()) {
      try {
        const response = await fetch(`http://localhost:3001/api/ticket/${ticketId}`);
        const data = await response.json();
        if (data.error) {
          alert(data.error);
          setTicketData(null);
        } else {
          setTicketData(data);
        }
      } catch (error) {
        alert('Failed to fetch ticket data: ' + error.message);
        setTicketData(null);
      }
    }
  };

  return (
    <div className="app">
      <div className="container">
        <p>Enter your ticket ID to generate the code</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="Enter Ticket ID"
            className="ticket-input"
          />
          <button type="submit" className="generate-btn">
            Generate Code
          </button>
        </form>
        {ticketData && (
          <div className="ticket-result">
            <h3>Ticket Information</h3>
            <p><strong>ID:</strong> {ticketData['Ticket ID']}</p>
            <p><strong>Project Name:</strong> {ticketData['Project Name']}</p>
            <p><strong>Creation Date:</strong> {ticketData['Creation Date']}</p>
            <p><strong>Title:</strong> {ticketData['Title']}</p>
            <p><strong>Description:</strong> {ticketData['Description']}</p>
            <p><strong>Priority:</strong> {ticketData['Priority']}</p>
            <p><strong>Status:</strong> {ticketData['Status']}</p>
            <p><strong>Attachments:</strong> {ticketData['Attachments'] || 'None'}</p>
            <p><strong>Subtasks:</strong> {ticketData['Subtasks'] || 'None'}</p>
            <p><strong>Issue Links:</strong> {ticketData['Issue Links'] || 'None'}</p>
            <p><strong>Web Links:</strong> {ticketData['Web Links'] || 'None'}</p>
            <p><strong>Design Links:</strong> {ticketData['Design Links'] || 'None'}</p>
            <p><strong>Comments:</strong> {ticketData['Comments'] && ticketData['Comments'].length > 0 ? ticketData['Comments'].join('; ') : 'None'}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;