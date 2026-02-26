/**
 * Base URL for the Firebase Realtime Database API endpoint.
 * Used for all backend HTTP requests.
 * 
 * @global
 * @constant
 * @type {string}
 * @readonly
 */
const BASE_URL = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Temporary cache object for storing fetched data from the API.
 * Structure depends on the endpoint responses.
 * 
 * @global
 * @type {Object.<string, any>}
 */
let fetchData = {};

/**
 * Application state array holding all contact entries.
 * Each item represents a contact object with properties like id, name, email, etc.
 * 
 * @global
 * @type {Array<Object>}
 * @property {string} id - Unique identifier for the contact
 * @property {string} name - Contact's full name
 * @property {string} [email] - Optional email address
 */
let contactsState = [];

/**
 * Fetches data from the backend and initializes `fetchData` and `contactsState`.
 * @async
 * @returns {Promise<void>}
 */
async function getData() {
  const response = await fetch(`${BASE_URL}.json`);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  /** @type {FetchData} */
  const data = await response.json();
  fetchData = data;
  contactsState = Object.entries(data?.contacts || {}).map(([key, contact]) => {
    return {
      id: key, name: contact.name, initials: contact.initials, color: contact.color, checked: false,
    };
  });
}

/**
 * Posts a new task payload to the backend.
 * @async
 * @param {TaskPayload} data
 * @returns {Promise<any>}
 */
async function postAddTask(data) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
}

/**
 * Posts `taskData` to the backend tasks collection.
 * @async
 * @param {Object} taskData - The task payload to post
 * @returns {Promise<any>}
 */
async function postData(taskData) {
  const response = await fetch(`${BASE_URL}/tasks.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  return response.json();
}