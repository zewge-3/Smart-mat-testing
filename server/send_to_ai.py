# send_to_ai.py
import requests
import json

def send_data_to_ai_service(data):
    url = 'http://localhost:5001/analyze'
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, headers=headers, data=json.dumps(data))
    return response.json()
