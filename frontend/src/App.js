import React, { useState, useEffect } from "react";
import "./App.css";
import APIHelper from "./APIHelper.js";

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [command, setCommand] = useState("");

  useEffect(() => {
    const fetchTodoAndSetTodos = async () => {
      const todos = await APIHelper.getAllTodos();
      setTodos(todos);
    };
    fetchTodoAndSetTodos();
  }, []);

  const runCommand = async e => {
    e.preventDefault();
    if (!todo) {
      alert("please enter something");
      return;
    }
    const todoList = awaitAPIHelper.getAllTodos();
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
    const todoList = await APIHelper.createTodo(todo);
    console.log(todoList);
    setTodos([...todoList]);
  };

  const deleteTodo = async (e, id) => {
    try {
      e.stopPropagation();
      const todoList = await APIHelper.deleteTodo(id);
      setTodos([...todoList]);
    } catch (err) { }
  };

  const updateTodo = async (e, id) => {
    e.stopPropagation();
    const payload = { completed: !todos.find(todo => todo._id === id).completed }
    const todoList = await APIHelper.updateTodo(id, payload);
    setTodos(todoList);

  };

  return (
    <div className="App">
      <div>
        <input
          type="text"
          value={todo}
          onChange={({ target }) => setCommand(target.value)}
          placeholder="Enter a command"
        />
        <button type="button" onClick={createTodo}>
          Add
        </button>
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
    </div>
  );
}

export default App;
