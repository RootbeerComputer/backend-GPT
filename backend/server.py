import json
from flask import Flask
import ray
ray.init()


import requests

@ray.remote
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
db = json.load(open('db.json','r'))
print("INITIAL DB STATE")
print(db['todo_list']["state"])

@app.route('/<app_name>/<api_call>')
def api(app_name, api_call):
    db = json.load(open('db.json','r'))
    print(db[app_name]["state"])
    gpt3_input = f"""{db[app_name]["prompt"]}
API Call (indexes are zero-indexed):
{api_call}

Database State:
{db[app_name]["state"]}

Output the API response prefixed with 'API response:'. Then output the new database state as json, prefixed with 'New Database State:'. If the API call is only requesting data, then don't change the database state, but base your 'API Response' off what's in the database.
"""
    completion = ray.get(gpt3.remote(gpt3_input))
    completion = json.loads(completion)["text"]

    future1 = gpt3.remote(f"{completion}\n\nAPI Response (as above, ignoring new database state, as json): ")
    future2 = gpt3.remote(f"{completion}\n\nThe value of 'New Database State' above (as json):")
    response = json.loads(ray.get(future1))["text"]
    print("RESPONSE")
    print(response)
    new_state = json.loads(json.loads(ray.get(future2))["text"])
    print("NEW_STATE")
    print(new_state)
    db[app_name]["state"] = new_state
    json.dump(db, open('db.json', 'w'), indent=4, default=dict_to_json)
    return response

if __name__ == "__main__":
    app.run()