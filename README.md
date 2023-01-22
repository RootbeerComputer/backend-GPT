Imagine living in a world where every time you want to change your frontend, you also have to change your backend. The downstream effects wouldn't be great. For one, showing the user different data would require asking your backend engineers to write a new api endpoint. Furthermore, you have to make an agreement with the backend people on the API contract.

This world would suck, so we are imagining a new one.

Who needs Postgres? We have a database with 1KB of storage. And it can do your biz logic too.

All you have to do is write one line describing the purpose of your app.

"This is a todo list app"

or

"You are a chess assistant"

Then
You can start making api calls. We've done away with the notion of an API contract, and writing backend code.

The model will see the API call, and apply whatever biz logic you probably wanted!
