import update from 'immutability-helper';
import { useEffect } from "react";

/**
 * Get the list of todo items.
 * @return {Array}
 */
export function getAll() {
    useEffect(() => {
        console.log(process.env.REACT_APP_BACKEND_URL)
        fetch(`${process.env.REACT_APP_BACKEND_URL}/todo_list/get_all()`, { method: 'GET' }).then(res => {
            console.log(res.body)
            return res.json()
        })
    })

}

export function getItemById(itemId) {
    return getAll().find(item => item.id === itemId);
}

export async function runCommand(text) {

    return getAll()
}

export async function updateStatus(items, itemId, completed) {
    let index = items.findIndex(item => item.id === itemId);
    // Returns a new list of data with updated item.
    return update(items, {
        [index]: {
            completed: { $set: completed }
        }
    });

    return getAll()

}

/**
 * A counter to generate a unique id for a todo item.
 * Can remove this logic when the todo is created using backend/database logic.
 * @type {Number}
 */
let todoCounter = 1;

function getNextId() {
    return getAll().length + todoCounter++;
}

/**
 * Adds a new item on the list and returns the new updated list (immutable).
 *
 * @param {Array} list
 * @param {Object} data
 * @return {Array}
 */
export async function addToList(list, data) {
    let item = Object.assign({
        id: getNextId()
    }, data);

    return list.concat([item]);
}
