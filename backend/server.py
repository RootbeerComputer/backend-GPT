import json
from flask import Flask
from flask_cors import CORS
import requests
import re
import ast

def gpt3(input):
    response = requests.post(
    "https://dashboard.scale.com/spellbook/api/app/kw1n3er6",
    json={
            "input": input
        },
    headers={"Authorization":"Basic cld6n7eoo0065sr1acbwczykv"}
    )
    return response.text

def dict_to_json(d):
    return d.__dict__

app = Flask(__name__)
CORS(app)
db = json.load(open('db.json','r'))
print("INITIAL DB STATE")
print(db['todo_list']["state"])

@app.route('/<app_name>/<api_call>')
def api(app_name, api_call):
    db = json.load(open('db.json','r'))
    print("INPUT DB STATE")
    print(db[app_name]["state"])
    gpt3_input = f"""{db[app_name]["prompt"]}
API Call (indexes are zero-indexed):
{api_call}

Database State:
{db[app_name]["state"]}

Output the API response as json prefixed with '!API response!:'. Then output the new database state as json, prefixed with '!New Database State!:'. If the API call is only requesting data, then don't change the database state, but base your 'API Response' off what's in the database.
"""
    completion = gpt3(gpt3_input)
    completion = json.loads(completion)["text"]

    # parsing "API Response" and "New Database State" with regex
    api_response_match = re.search("(?<=!API Response!:).*(?=!New Database State!:)", completion, re.DOTALL)
    new_database_match = re.search("(?<=!New Database State!:).*", completion, re.DOTALL)

    # converting regex result into json string
    api_response_text = api_response_match.string[api_response_match.regs[0][0]:api_response_match.regs[0][1]].strip()
    new_database_text = new_database_match.string[new_database_match.regs[0][0]:new_database_match.regs[0][1]].strip()

    response = json.loads(json.dumps(ast.literal_eval(api_response_text)))
    print("RESPONSE")
    print(response)

    new_state = json.loads(json.dumps(ast.literal_eval(new_database_text)))
    print("NEW_STATE")
    print(new_state)

    db[app_name]["state"] = new_state
    json.dump(db, open('db.json', 'w'), indent=4, default=dict_to_json)
    return response

if __name__ == "__main__":
    app.run()