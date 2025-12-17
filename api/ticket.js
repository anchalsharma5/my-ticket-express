const { JIRA } = require('jira-client');

const jira = new JIRA({
  protocol: 'https',
  host: process.env.JIRA_HOST,
  username: process.env.JIRA_USER,
  password: process.env.JIRA_TOKEN,
  apiVersion: '2',
  strictSSL: true
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ticket_id } = req.query;
  
  if (!ticket_id) {
    return res.status(400).json({ error: 'ticket_id is required' });
  }

  try {
    const issue = await jira.findIssue(ticket_id);
    
    const ticketData = {
      'Ticket ID': issue.key,
      'Description': issue.fields.description,
      'Title': issue.fields.summary,
      'Status': issue.fields.status.name,
      'Priority': issue.fields.priority ? issue.fields.priority.name : null
    };

    res.status(200).json(ticketData);
  } catch (error) {
    res.status(404).json({ error: `Ticket not found: ${error.message}` });
  }
}