import json
from flask import Flask
import ray
from flask_cors import CORS
import requests
import dotenv
import os

dotenv.load_dotenv()
ray.init()

@ray.remote
def gpt3(input, auth):
    response = requests.post("https://dashboard.scale.com/spellbook/api/app/kw1n3er6", 
                             json={'input': input}, 
                             headers={'Authorization': auth})
    return response.text

def dict_to_json(d):
    return d.__dict__

class GPTBackend:
    def __init__(self):
        # app 
        self._app = Flask(__name__)
        CORS(self._app)
        # db
        self._db = json.load(open('db.json', 'r'))
        print("INITIAL DB STATE")
        print(self._db['todo_list']["state"])
        # auth
        self._auth = f"Basic {os.environ['SCALE_BASIC_AUTH']}"

        # routes
        @self._app.route('/<app_name>/<api_call>')
        def api(app_name, api_call):
            db = json.load(open('db.json','r'))
            print("INPUT DB STATE")
            print(db[app_name]["state"])
            gpt3_input = (f"{db[app_name]['prompt']}\n"
                        f"API Call (indexes are zero-indexed):\n"
                        f"{api_call}\n"
                        f"\n"
                        f"Database State:\n"
                        f"{db[app_name]['state']}\n"
                        f"\n"
                        "Output the API response prefixed with 'API response:'. "
                        "Then output the new database state as json, prefixed with 'New Database State:'. "
                        "If the API call is only requesting data, then don't change the database state, "
                        "but base your 'API Response' off what's in the database.")
            
            # generate request
            completion = ray.get(gpt3.remote(gpt3_input, self._auth))
            completion = json.loads(completion)["text"]

            # parse response
            future1 = gpt3.remote(f"{completion}\n\nAPI Response as valid json (as above, ignoring new database state): ", self._auth)
            future2 = gpt3.remote(f"{completion}\n\nThe value of 'New Database State' above (as json):", self._auth)
            response = json.loads(ray.get(future1).strip())["text"].strip()
            print("RESPONSE")
            print(response)
            new_state = json.loads(json.loads(ray.get(future2).strip())["text"].strip())
            print("NEW_STATE")
            print(new_state)
            db[app_name]["state"] = new_state
            json.dump(db, open('db.json', 'w'), indent=4, default=dict_to_json)
            return response
    
    def run(self):
        self._app.run()

if __name__ == "__main__":
    backend = GPTBackend()
    backend.run()