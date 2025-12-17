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

# JQL query to fetch the specific issue
jql_query = f'key = {ticket_id}'

# Fetch issues from Jira
try:
    issues = jira.search_issues(jql_query, fields='*all', maxResults=1)
except Exception as e:
    print(json.dumps({"error": f"Failed to fetch issues: {e}"}))
    sys.exit(1)

# Extract data
data = []
if issues:
    issue = issues[0]
    comments = [comment.body for comment in issue.fields.comment.comments]
    project_name = issue.key.split('-')[0]  # Extract project key from issue key
    data.append({
        'Ticket ID': issue.key,
        'Project Name': project_name,
        'Creation Date': issue.fields.created,
        'Title': issue.fields.summary,
        'Description': issue.fields.description,
        'Priority': issue.fields.priority.name if issue.fields.priority else None,
        'Status': issue.fields.status.name,
        'Attachments': ', '.join([att.filename for att in getattr(issue.fields, 'attachment', [])]),
        'Subtasks': ', '.join([subtask.key for subtask in getattr(issue.fields, 'subtasks', [])]),
        'Issue Links': ', '.join([f"{link.type.name}: {getattr(link, 'outwardIssue', getattr(link, 'inwardIssue', None)).key}" for link in getattr(issue.fields, 'issuelinks', []) if getattr(link, 'outwardIssue', None) or getattr(link, 'inwardIssue', None)]),
        'Web Links': ', '.join([link.object.url for link in getattr(issue.fields, 'remotelinks', []) if hasattr(link, 'object')]),
        'Design Links': ', '.join([link.object.url for link in getattr(issue.fields, 'remotelinks', []) if hasattr(link, 'object')]) or None,
        'Comments': comments
    })

if data:
    print(json.dumps(data[0]))
else:
    print(json.dumps({"error": "No ticket found"}))