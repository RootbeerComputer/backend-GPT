import sys
import pickle
import openai

import modal

stub = modal.Stub("not-an-api")
volume = modal.SharedVolume().persist("storage")

class Model:
    def __enter__(self):
        with open('db.pickle', 'rb') as handle:
            self.db = pickle.load(handle)

    @stub.function(
        shared_volumes={'/': volume},
    )
    def api(self, app_name, api_call):
        gpt3_input = f"""{self.db[app_name]["prompt"]}
API Call:
{api_call}

Database State:
{self.db[app_name]["state"]}

New Database State:
"""
        new_state = openai.call(gpt3_input)["completion"]
        self.db[app_name]["state"] = new_state
        with open('db.pickle', 'wb') as handle:
            pickle.dump(self.db, handle, protocol=pickle.HIGHEST_PROTOCOL)
        return "done"

if __name__ == "__main__":
    with stub.run():
        Model().predict(x)