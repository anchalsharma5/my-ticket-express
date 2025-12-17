const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ticket/:ticketId', (req, res) => {
  const ticketId = req.params.ticketId;
  const pythonScript = path.join(__dirname, 'fetch_jira_data.py');
  
  const python = spawn('/Users/e1246670/Desktop/Ticket Express/my-ticket-express/.venv/bin/python', [pythonScript, ticketId]);
  
  let output = '';
  let error = '';
  
  python.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  python.stderr.on('data', (data) => {
    error += data.toString();
  });
  
  python.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: `Failed to fetch ticket: ${error}` });
    }
    
    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (parseError) {
      res.status(500).json({ error: `Failed to parse response: ${parseError.message}` });
    }
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});