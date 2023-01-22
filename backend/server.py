import json
import openai
from flask import Flask

import modal

openai.api_key = "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" # "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"

stub = modal.Stub("not-an-api")
volume = modal.SharedVolume().persist("storage")

image = modal.Image.debian_slim().pip_install("openai")

def dict_to_json(d):
    return d.__dict__

app = Flask(__name__)

# @stub.function(
#     image=image,
#     shared_volumes={'/Users/evan/rizz-ur-api/backend': volume},
#     mounts=[modal.Mount(local_dir="/Users/evan/rizz-ur-api/backend/starting_data", remote_dir="/root")]
# )
@app.route('/<app_name>/<api_call>')
def api(app_name, api_call):
    db = json.load(open('db.json','r'))
    print(db)
    gpt3_input = f"""{db[app_name]["prompt"]}
API Call:
{api_call}

Database State:
{db[app_name]["state"]}

New Database State (as json):
"""
    completion = openai.Completion.create(
        model="text-davinci-003",
        prompt=gpt3_input,
        temperature=0.0,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    print("COMPLETION")
    print(completion["choices"][0]["text"].strip())
    new_state = json.loads(completion["choices"][0]["text"].strip())
    print("NEW_STATE")
    print(new_state)
    db[app_name]["state"] = new_state
    json.dump(db, open('db.json', 'w'), indent=4, default=dict_to_json)
    return "done"

if __name__ == "__main__":
    # with stub.run():
    #     api.call("todo_list", "add_task('buy milk")
    app.run()