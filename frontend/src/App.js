import React, { useState, useEffect } from "react";
import "./App.css";
import APIHelper from "./APIHelper.js";

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [command, setCommand] = useState("");
  const [commandOutput, setCommandOutput] = useState("No command output")

  useEffect(() => {
    const fetchTodoAndSetTodos = async () => {
      const todos = await APIHelper.getAllTodos();
      setTodos(todos);
    };
    fetchTodoAndSetTodos();
  }, []);

  const runCommand = async e => {
    e.preventDefault();
    if (!command) {
      alert("please enter something");
      return;
    }
    setCommandOutput("Command in progress");
    setCommandOutput(await APIHelper.runCommand(command));
    const todoList = await APIHelper.getAllTodos();
    setTodos([...todoList]);
  }

  const createTodo = async e => {
    e.preventDefault();
    if (!todo) {
      alert("please enter something");
      return;
    }
    if (todos.some(({ task }) => task === todo)) {
      alert(`Task: ${todo} already exists`);
      return;
    }
    setCommandOutput("Command in progress");
    setCommandOutput(await APIHelper.createTodo(todo));
    const todoList = await APIHelper.getAllTodos();
    setTodos([...todoList]);
  };

  const deleteTodo = async (e, id) => {
    try {
      e.stopPropagation();
      setCommandOutput("Command in progress");
      setCommandOutput(await APIHelper.deleteTodo(todos[id].title));
      const todoList = await APIHelper.getAllTodos();
      setTodos([...todoList]);
    } catch (err) { }
  };

  const updateTodo = async (e, id) => {
    e.stopPropagation();
    setCommandOutput("Command in progress");
    if (todos[id].completed === true) {
      setCommandOutput(await APIHelper.markIncomplete(todos[id].title));
    }
    else {
      setCommandOutput(await APIHelper.markComplete(todos[id].title));
    }
    const todoList = await APIHelper.getAllTodos();
    setTodos(todoList);

  };

  return (
    <div className="App">
      <div>
        All backend logic is being handled by an LLM
        <p />
      </div>
      <div>
        We've prebuilt requests to add todos, mark complete (click an incomplete todo), mark incomplete (click a completed todo), delete (click the x). Or you can run your own commands via the command bar. Play around!
        <p />
        For example, try something like "delete last 2 todos". It can handle some natural language, but it's generally better to do a function in pseudocode, like "add_todo_twice(do squats)".
        <p />
      </div>
      <div>
        <input
          type="text"
          value={todo}
          onChange={({ target }) => setTodo(target.value)}
          placeholder="Enter a todo"
        />
        <button type="button" onClick={createTodo}>
          Add
        </button>
      </div>

      <ul>
        {todos.length ? todos.map(({ title, completed }, i) => (
          <li
            key={i}
            onClick={e => updateTodo(e, i)}
            className={completed ? "completed" : ""}
          >
            {title} <span onClick={e => deleteTodo(e, i)}>X</span>
          </li>
        )) : <p>No Todos Yet :(</p>}
      </ul>
      <div>
        http://localhost:5000/todo_list/<input
          type="text"
          value={command}
          onChange={({ target }) => setCommand(target.value)}
          placeholder="Enter a command"
        />
        <button type="button" onClick={runCommand}>
          Run
        </button>
      </div>
      <div>
        Command Output:
        <div>
          {commandOutput}
        </div>
      </div>
    </div>
  );
}

export default App;
