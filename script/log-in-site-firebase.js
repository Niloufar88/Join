/**
 * Base Firebase Realtime Database API endpoint URL.
 * Used as the root path for all backend HTTP requests.
 *
 * @global
 * @constant
 * @type {string}
 */
const BASE_URL = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Firebase Realtime Database URL for guest user data storage.
 * Used to store temporary or non-persistent guest session information.
 *
 * @global
 * @constant
 * @type {string}
 */
const guestURL = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/guest";

/**
 * Reference to the login form DOM element.
 * Used to handle form submission and validation.
 *
 * @global
 * @constant
 * @type {HTMLFormElement}
 */
const form = document.getElementById("login_form");

/**
 * Local cache object storing the current state of contact data from the database.
 * Structure matches the remote database response format.
 *
 * @global
 * @type {Object.<string, any>}
 */
let fetchedData;

/**
 * Local cache object storing the current state of guest user data from the database.
 * Used for temporary or non-persistent session information.
 *
 * @global
 * @type {Object.<string, any>}
 */
let fetchedDataGuest;

/**
 * Flag indicating whether an email address has already been found in the database.
 * Prevents duplicate processing during login attempts.
 *
 * @global
 * @type {boolean}
 * @default false
 */
let emailFound = false;

/**
 * NodeList reference to all input fields within the form.
 * Used for bulk validation or event listener attachment.
 *
 * @global
 * @constant
 * @type {NodeList<HTMLInputElement>}
 */
const inputs = document.querySelectorAll("input");

/**
 * Reference to the email input field DOM element.
 * Used to retrieve user's email address during login.
 *
 * @global
 * @constant
 * @type {HTMLInputElement}
 */
const emailInput = document.getElementById("email");

/**
 * Reference to the password input field DOM element.
 * Used to retrieve user's password during login.
 *
 * @global
 * @constant
 * @type {HTMLInputElement}
 */
const passwordInput = document.getElementById("password");

/**
 * Reference to the error message DOM element for password validation.
 * Displays validation errors specific to the password field.
 *
 * @global
 * @constant
 * @type {HTMLElement}
 */
const passwordErrorMsg = document.getElementById("passwordErrorMsg");

/**
 * Reference to the error message DOM element for email validation.
 * Displays validation errors specific to the email field.
 *
 * @global
 * @constant
 * @type {HTMLElement}
 */
const emailErrorMsg = document.getElementById("emailErrorMsg");

/**
 * a function which turns the password into a hashed value using SHA-256 algorithm. It takes the password as input, encodes it, and returns the hashed password as a hexadecimal string.
 * @param {string} password
 * @returns {Promise<string>} Returns the hashed password as a hexadecimal string.
 */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

/**
 * a function which checks all the login validation functions for the email and password input fields. If any of the validation functions return false, it shows an error message and highlights the respective input field in red. It also fetches the user data from the database and checks if the email exists and if the password is correct. If both email and password are correct, it stores the user ID, user status, and name in session storage and redirects the user to the summary page. If the email is not found or the password is incorrect, it shows an error message.
 */
async function loginValidation() {
  passwordErrorMsg.style.visibility = "hidden";
  emailErrorMsg.style.visibility = "hidden";
  inputs.forEach((input) => {
    input.style.borderColor = "#29abe2";
  });
  emailFound = false;
  await loginDatafetch();
  await ifEmailFoundFunction();
  if (!emailFound) emailErrorMsgShow();
}

/**
 * a function which shows an error message and highlights the password input field in red if the password is less than 6 characters long.
 */
function passwordErrorMsgShow() {
  const passwordErrorMsg = document.getElementById("passwordErrorMsg");
  passwordErrorMsg.style.visibility = "visible";
  passwordErrorMsg.textContent = "Check your password and try again.";
  passwordInput.style.borderColor = "#e60026";
}

/**
 * a function which shows an error message and highlights the email input field in red if the email is not found in the database.
 */
function emailErrorMsgShow() {
  const emailErrorMsg = document.getElementById("emailErrorMsg");
  emailErrorMsg.style.visibility = "visible";
  emailErrorMsg.textContent = "Check your email and try again.";
  emailInput.style.borderColor = "#e60026";
}

/**
 * an async function which checks if the email exists in the database. If it does, it checks if the password is correct. If both email and password are correct, it stores the user ID, user status, and name in session storage and redirects the user to the summary page. If the email is not found or the password is incorrect, it shows an error message.
 */
async function ifEmailFoundFunction() {
  for (const id in fetchedData) {
    const user = fetchedData[id];
    if (user.email === emailInput.value) {
      emailFound = true;
      let passwor2 = passwordInput.value;
      let passwordHased = await hashPassword(passwor2);
      if (user.password === passwordHased) {
        sessionStorage.setItem("userID", user.id);
        sessionStorage.setItem("userStatus", "loggedIn");
        sessionStorage.setItem("name", user.name);
        window.location.href = "../html/summary.html";
      } else passwordErrorMsgShow();
    }
  }
}

/**
 * fetch data from firebase with "GET" Methode for the registered users to check the email and password for login validation
 */
async function loginDatafetch() {
  try {
    const response = await fetch(BASE_URL + "/users.json");
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    }
    const responseToJson = await response.json();
    if (responseToJson && typeof responseToJson === "object") {
      fetchedData = {};
      for (const [id, userData] of Object.entries(responseToJson)) {
        fetchedData[id] = {
          id: id,
          email: userData.email,
          password: userData.password,
          name: userData.name,
        };
      }
    } else {
      fetchedData = {};
    }
  } catch (error) {
    console.error("Fehler beim laden der Daten:", error);
    fetchedData = {};
  }
}

/**
 * the function to direct the "guest" to summary page by checking the guest data from firebase
 * and rendering the guest name initial "G" in the header
 * and ignore the name of guest in welcome message
 */

async function guestLogin() {
  await loginDatafetchGuest();
  if (fetchedDataGuest && fetchedDataGuest.name === "Guest") {
    sessionStorage.setItem("name", fetchedDataGuest.name);
    window.location.href = "../html/summary.html";
  } else {
    console.error("Guest login failed - invalid guest data");
  }
}

/**
 * fetch data from firebase with "GET" Methode for guest user
 * @returns fetched data from firebase for guest in a direct structure, so the information can be used to extract initials for header.
 */
async function loginDatafetchGuest() {
  try {
    const response = await fetch(guestURL + ".json");
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return;
    }
    const responseToJson = await response.json();
    if (responseToJson && typeof responseToJson === "object") {
      if (responseToJson.name) {
        fetchedDataGuest = { name: responseToJson.name };
      } else {
        const firstEntry = Object.values(responseToJson)[0];
        fetchedDataGuest = firstEntry ? { name: firstEntry.name } : {};
      }
    } else {
      fetchedDataGuest = {};
    }
  } catch (error) {
    console.error("Fehler beim laden der Daten:", error);
    fetchedDataGuest = {};
  }
}

/**
 * a function which prevents the default form submission behavior when the login form is submitted. This allows us to handle the form submission with our custom login validation logic instead of the default page reload.
 * @param {*} event
 */
function handleForm(event) {
  event.preventDefault();
}

form.addEventListener("submit", handleForm);
