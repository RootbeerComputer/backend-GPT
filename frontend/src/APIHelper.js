import axios from "axios";

const API_URL = "http://localhost:5000/todo_list"
async function createTodo(task) {
  await axios.get(`${API_URL}/add_todo(${task})`);
  return await getAllTodos()
}

async function deleteTodo(title) {
  await axios.get(`${API_URL}/delete(${title})`);
  return await getAllTodos()
}

async function markIncomplete(title) {
  await axios.get(`${API_URL}/mark_incomplete(${title})`);
  return await getAllTodos()
}
async function markComplete(title) {
  await axios.get(`${API_URL}/mark_complete(${title})`)
  return await getAllTodos();
}

async function runCommand(command) {

}

async function getAllTodos() {
  const res = await axios.get(`${API_URL}/get_all()`);
  return res.data;
}

export default { createTodo, deleteTodo, markIncomplete, markComplete, getAllTodos };
