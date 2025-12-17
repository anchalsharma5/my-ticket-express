import React, { useState } from 'react';
import './App.css';

function App() {
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticketId.trim()) {
      alert(`Generating code for ticket: ${ticketId}`);
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
      </div>
    </div>
  );
}

export default App;