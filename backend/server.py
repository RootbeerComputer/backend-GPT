import json
import openai
from flask import Flask

import modal

import requests

def gpt3(input):
    response = requests.post(
    "https://dashboard.scale.com/spellbook/api/app/kw1n3er6",
    json={
            "input": input
        },
    headers={"Authorization":"Basic cld6n7eoo0065sr1acbwczykv"}
    )
    return response.text

stub = modal.Stub("not-an-api")
volume = modal.SharedVolume().persist("storage")

image = modal.Image.debian_slim().pip_install("openai")

def dict_to_json(d):
    return d.__dict__

app = Flask(__name__)
db = json.load(open('db.json','r'))
print(db['todo_list']["state"])
# @stub.function(
#     image=image,
#     shared_volumes={'/Users/evan/rizz-ur-api/backend': volume},
#     mounts=[modal.Mount(local_dir="/Users/evan/rizz-ur-api/backend/starting_data", remote_dir="/root")]
# )
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
    completion = gpt3(gpt3_input)
    completion = json.loads(completion)["text"]
    response = json.loads(gpt3(f"{completion}\n\nAPI Response (as above, ignoring new database state, as json): "))["text"]
    print("RESPONSE")
    print(response)
    new_state = json.loads(json.loads(gpt3(f"{completion}\n\nThe value of 'New Database State' above (as json):"))["text"])
    print("NEW_STATE")
    print(new_state)
    db[app_name]["state"] = new_state
    json.dump(db, open('db.json', 'w'), indent=4, default=dict_to_json)
    return response

if __name__ == "__main__":
    # with stub.run():
    #     api.call("todo_list", "add_task('buy milk")
    app.run()