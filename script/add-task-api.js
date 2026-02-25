const BASE_URL = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/";
let fetchData = {};
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