import axios from "axios";

const API_URL = "http://localhost:5000/todo_list"
async function createTodo(task) {
  const { data: newTodo } = await axios.post(API_URL, {
    task
  });
  return newTodo;
}

async function deleteTodo(id) {
  const message = await axios.delete(`${API_URL}${id}`);
  return message;
}

async function updateTodo(id, payload) {
  const { data: newTodo } = await axios.put(`${API_URL}${id}`, payload);

  return newTodo;
}

async function getAllTodos() {
  const res = await axios.get(`${API_URL}/get_all()`);
  return [{ 'title': 'Buy Milk', 'completed': true }, { 'title': 'Do laundry', 'completed': false }]
  // console.log(res.data)
  // console.log(JSON.parse(res.data))
  // return JSON.parse(res.data);
}

export default { createTodo, deleteTodo, updateTodo, getAllTodos };
