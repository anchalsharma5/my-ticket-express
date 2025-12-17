from jira import JIRA
import sys
import json

import os

# Jira server and authentication
jira_server = f"https://{os.getenv('JIRA_HOST')}"
jira_user = os.getenv('JIRA_USER')
jira_api_token = os.getenv('JIRA_TOKEN')

# Connect to Jira
try:
    jira = JIRA(server=jira_server, basic_auth=(jira_user, jira_api_token))
except Exception as e:
    print(json.dumps({"error": f"Failed to connect to Jira: {e}"}))
    sys.exit(1)

# Get ticket ID from command line argument
if len(sys.argv) != 2:
    print(json.dumps({"error": "Please provide ticket ID as argument"}))
    sys.exit(1)

ticket_id = sys.argv[1]

# Fetch specific issue by ID
try:
    issue = jira.issue(ticket_id, fields='*all')
    
    # Extract data for the specific ticket
    ticket_data = {
        'Ticket ID': issue.key,
        'Description': issue.fields.description,
        'Title': issue.fields.summary,
        'Status': issue.fields.status.name,
        'Priority': issue.fields.priority.name if issue.fields.priority else None
    }
    
    print(json.dumps(ticket_data))
    
except Exception as e:
    print(json.dumps({"error": f"Failed to fetch ticket {ticket_id}: {e}"}))
    sys.exit(1)