import React, { useState, useEffect } from "react";
import "./App.css";
import APIHelper from "./APIHelper.js";

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");

  useEffect(() => {
    const fetchTodoAndSetTodos = async () => {
      const todos = await APIHelper.getAllTodos();
      setTodos(todos);
    };
    fetchTodoAndSetTodos();
  }, []);

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
          onChange={({ target }) => setTodo(target.value)}
          placeholder="Enter a todo"
        />
        <button type="button" onClick={createTodo}>
          Add
        </button>
      </div>

      <ul>
        {todos.length ? todos.map(({ task, completed }, i) => (
          <li
            key={i}
            onClick={e => updateTodo(e, i)}
            className={completed ? "completed" : ""}
          >
            {task} <span onClick={e => deleteTodo(e, i)}>X</span>
          </li>
        )) : <p>No Todos Yet :(</p>}
      </ul>
    </div>
  );
}

export default App;
