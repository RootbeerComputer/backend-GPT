### Auth
```
cp .env.sample .env
```
Fill `SCALE_BASIC_AUTH=***`

### Run
```
python3 server.py
curl "http://127.0.0.1:5000/todo_list/mark_incomplete(3)"
curl "http://127.0.0.1:5000/todo_list/get_all()"
```

**Ignore everything below**

Install requirements
```
pip3 install -r requirements.txt
```
We have starting data in `starting_data/db.json`

You can run on a real life modal server with this command. But you need to set up modal keys
```
modal run server.py --app-name "todo_list" --api-call "complete_task(1)"
```

You can run locally with
```
python3 server.py
```