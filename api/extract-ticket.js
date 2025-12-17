const { spawn } = require('child_process');
const path = require('path');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ticket_id } = req.body;
  
  if (!ticket_id) {
    return res.status(400).json({ error: 'ticket_id is required' });
  }

  try {
    const pythonScript = path.join(process.cwd(), 'extract_ticket.py');
    const python = spawn('python3', [pythonScript, ticket_id]);
    
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
        return res.status(500).json({ error: `Python script failed: ${error}` });
      }
      
      try {
        const result = JSON.parse(output);
        res.status(200).json(result);
      } catch (parseError) {
        res.status(500).json({ error: `Failed to parse response: ${parseError.message}` });
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
}