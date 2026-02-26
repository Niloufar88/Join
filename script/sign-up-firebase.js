/**
 * an async function to register a user by sending their data to the Firebase Realtime Database
 */
const firebaseURL =
  "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/users";

/**
 * Registers a new user by sending their data to Firebase Realtime Database.
 * Handles HTTP request and error display if registration fails.
 *
 * @async
 * @function registerUser
 * @param {string} name - The user's full name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password (should be hashed in production).
 * @returns {Promise<void>} Resolves when the request is completed.
 * @sideeffects {Network} Performs HTTP POST request to Firebase. Shows error message on failure.
 * @requires {string} firebaseURL - Base URL for Firebase API endpoint.
 * @requires {function} showErrorMessage - Displays error feedback to the user.
 * @throws {Error} If the network request fails.
 */
async function registerUser(name, email, password) {
  const userData = {
    name: name,
    email: email,
    password: password,
  };
  try {
    const response = await fetch(firebaseURL + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
  } catch (err) {
    console.error(err);
    showErrorMessage("Registration failed. Please try again.");
  }
}

/**
 * an async function to fetch existing user names from the Firebase Realtime Database and return them as an array. This function is used to check if a user name is already registered before allowing a new registration.
 * @returns an Array with possible registered Names
 */
async function fetchExistingUserName() {
  try {
    const response = await fetch(firebaseURL + ".json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const existingNames = [];
    if (data && typeof data === "object") {
      for (const [id, userData] of Object.entries(data)) {
        if (userData.name) {
          existingNames.push(userData.name);
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
 * an async function to fetch existing user emails from the Firebase Realtime Database and return them as an array. This function is used to check if an email is already registered before allowing a new registration.
 * @returns an Array of possible registered Emails
 */
async function fetchExistingUserEmail() {
  try {
    const response = await fetch(firebaseURL + ".json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const existingEmails = [];
    if (data && typeof data === "object") {
      for (const [id, userData] of Object.entries(data)) {
        if (userData.email) {
          existingEmails.push(userData.email);
        }
      }
      return existingEmails;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Function to show a success message after signing up
 */
function showSuccessMessage() {
  const messageBox = document.getElementById("message");
  messageBox?.classList.add("show");
}

/**
 * Function to show different error messages if something fails.
 * 
 * @description
 * Displays error feedback in the DOM for form validation issues.
 * Sets the text content and visibility of specific error message elements.
 */

/**
 * Shows an error message for the name input field.
 * Updates the name error element's text and makes it visible.
 *
 * @function nameErrorMessage
 * @param {string} message - The error message to display.
 * @returns {void}
 * @sideeffects Modifies DOM element 'name-error-message' (text and visibility)
 */
function nameErrorMessage(message) {
  const errorMsg = document.getElementById("name-error-message");
  errorMsg.textContent = message;
  errorMsg.style.visibility = "visible";
}

/**
 * Shows an error message for the email input field.
 * Updates the email error element's text and makes it visible.
 *
 * @function emailErrorMessage
 * @param {string} message - The error message to display.
 * @returns {void}
 * @sideeffects Modifies DOM element 'email-error-message' (text and visibility)
 */
function emailErrorMessage(message) {
  const errorMsg = document.getElementById("email-error-message");
  errorMsg.textContent = message;
  errorMsg.style.visibility = "visible";
}

/**
 * Shows an error message for the password input field.
 * Updates the password error element's text and makes it visible.
 *
 * @function passwordErrorMessage
 * @param {string} message - The error message to display.
 * @returns {void}
 * @sideeffects Modifies DOM element 'password-error-message' (text and visibility)
 */
function passwordErrorMessage(message) {
  const errorMsg = document.getElementById("password-error-message");
  errorMsg.textContent = message;
  errorMsg.style.visibility = "visible";
}

/**
 * Shows an error message for the confirm password input field.
 * Updates the confirm password error element's text and makes it visible.
 *
 * @function confirmPasswordErrorMessage
 * @param {string} message - The error message to display.
 * @returns {void}
 * @sideeffects Modifies DOM element 'confirmpassword-error-message' (text and visibility)
 */
function confirmPasswordErrorMessage(message) {
  const errorMsg = document.getElementById("confirmpassword-error-message");
  errorMsg.textContent = message;
  errorMsg.style.visibility = "visible";
}

/**
 * function to reset the form and hide error messages after successful registration
 */
function resetPageDefaults() {
  const form = document.getElementById("signupForm");
  form.reset();
  const errorMsgs = document.querySelectorAll(".error-message");
  errorMsgs.forEach((errorMsg) => {
    errorMsg.style.visibility = "hidden";
  });
  UpdateIcon(passwordInput, iconPasswordDivMain);
  UpdateIcon(passwordConfirm, iconPasswordDivConfirm);
}

/**
 * a function which hashes a password using the SHA-256 algorithm.
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} - Returns a promise that resolves to the hashed password in hexadecimal format.
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
