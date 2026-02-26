/**
 * Firebase Realtime Database URL for the specific "contacts" collection.
 * Used for creating and saving individual contact data entries.
 *
 * @global
 * @constant
 * @type {string}
 */
const storageUrl = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/contacts";

/**
 * Base Firebase Realtime Database API endpoint URL.
 * Used as the root path for all backend HTTP requests.
 *
 * @global
 * @constant
 * @type {string}
 * @readonly
 */
const BASE_URL = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Local cache object storing the current state of contact data from the database.
 * Structure matches the remote database response format.
 *
 * @global
 * @type {Object.<string, any>}
 */
let fetchedData = {};

/**
 * defines async function to fetch Contact Data throw Firebase realtime Database:
 * fetch storageUrl using GET method and return the fetched data as JSON object.
 * doing a for loop to add the id to each contact object and extract the data from object entries to a new object.
 * @returns fetchedData object containing contacts with their IDs or {} in case of error.
 */
async function loadDataBase() {
  try {
    const response = await fetch(storageUrl + ".json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseToJson = await response.json();
    if (responseToJson && typeof responseToJson === "object") {
      fetchedData = {};
      for (const [id, contactData] of Object.entries(responseToJson)) {
        fetchedData[id] = { id, ...contactData };
      }
    } else {
      fetchedData = {};
    }
    return fetchedData;
  } catch (error) {
    console.error("Error loading database:", error);
    fetchedData = {};
    return {};
  }
}

/**
 * a function which saves a new contact to the Firebase Realtime Database.
 * @param {Object} contact - The contact object containing name, email, and phone.
 * @returns {Object} The result of the save operation.
 */
async function saveContact(contact) {
  try {
    const response = await fetch(storageUrl + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error saving contact:", error);
    throw error;
  }
}

/**
 * defines an async function to delete contact from Firebase realtime Database:
 * fetch storageUrl/contactId using DELETE method and return the result.
 * @param {String} contactId
 * @returns an object containing the result of the delete operation or throws an error in case of failure.
 */
async function deleteContact(contactId) {
  try {
    const response = await fetch(`${storageUrl}/${contactId}.json`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
}

/**
 * a function which updates an existing contact in the Firebase Realtime Database.
 * @param {string} contactId - The ID of the contact to be updated.
 * @param {Object} updatedContact - The updated contact object containing name, email, and phone.
 * @returns {Object} The result of the update operation.
 */
async function updateContactInFirebase(contactId, updatedContact) {
  try {
    const response = await fetch(`${storageUrl}/${contactId}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedContact),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
}

/**
 * an async function to fetch existing user names from the Firebase Realtime Database and return them as an array. This function is used to check if a user name is already registered before allowing a new registration.
 * @returns {Array} An array with possible registered names.
 */
async function fetchExistingContactName() {
  try {
    const response = await fetch(storageUrl + ".json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const existingNames = [];
    if (data && typeof data === "object") {
      for (const [id, contactData] of Object.entries(data)) {
        if (contactData.name) {
          existingNames.push(contactData.name);
        }
      }
      return existingNames;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * an async function to fetch existing contact emails from the Firebase Realtime Database and return them as an array. This function is used to check if an email already exists before allowing it to be saved again.
 * @returns {Array} An array of already saved contact emails.
 */
async function fetchExistingContactEmail() {
  try {
    const response = await fetch(storageUrl + ".json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const existingEmails = [];
    if (data && typeof data === "object") {
      for (const [id, contactData] of Object.entries(data)) {
        if (contactData.email) {
          existingEmails.push(contactData.email);
        }
      }
      return existingEmails;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}
