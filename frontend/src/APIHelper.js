import axios from "axios";

const API_URL = "http://localhost:5000/todo_list"
async function createTodo(task) {
  const data = await (await axios.get(`${API_URL}/add_todo(${task})`)).data;
  return data.message;
}

async function deleteTodo(title) {
  const data = await (await axios.get(`${API_URL}/delete(${title})`)).data;
  return data.message;
}

async function markIncomplete(title) {
  const data = await (await axios.get(`${API_URL}/mark_incomplete(${title})`)).data;
  return data.message;
}
async function markComplete(title) {
  const data = await (await axios.get(`${API_URL}/mark_complete(${title})`)).data
  return data.message;
}

async function runCommand(command) {
  const data = await (await axios.get(`${API_URL}/${command})`)).data;
  return data.message;
}

async function getAllTodos() {
  const res = await axios.get(`${API_URL}/get_all()`);
  return res.data;
}

export default { createTodo, deleteTodo, markIncomplete, markComplete, getAllTodos, runCommand };
