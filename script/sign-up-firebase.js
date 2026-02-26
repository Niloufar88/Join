/**
 * an async function to register a user by sending their data to the Firebase Realtime Database
 */
const firebaseURL =
  "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/users";

/**
* Registriert einen neuen Benutzer in der Firebase-Datenbank.
* * @async
* @function registerUser
* @param {string} name - Der vollständige Name des Benutzers.
* @param {string} email - Die E-Mail-Adresse des Benutzers.
* @param {string} password - Das gewählte Passwort.
* * @description
* Erstellt ein Benutzerobjekt und sendet es per POST-Request an die Firebase-REST-API.
* Im Fehlerfall (Netzwerk oder Server) wird eine Fehlermeldung im UI angezeigt.
* * @requires firebaseURL - Die Basis-URL zur Firebase Realtime Database.
* @returns {Promise<void>} Ein Promise, das nach Abschluss des Registrierungsprozesses aufgelöst wird.
* * @example
* await registerUser("Max Mustermann", "max@beispiel.de", "sicheresPasswort123");
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
 * function to show different error messages if something fails
 * @param {String} message
 */
function nameErrorMessage(message) {
  const errorMsg = document.getElementById("name-error-message");
  errorMsg.textContent = message;
  errorMsg.style.visibility = "visible";
}

function emailErrorMessage(message) {
  const errorMsg = document.getElementById("email-error-message");
  errorMsg.textContent = message;
  errorMsg.style.visibility = "visible";
}

function passwordErrorMessage(message) {
  const errorMsg = document.getElementById("password-error-message");
  errorMsg.textContent = message;
  errorMsg.style.visibility = "visible";
}

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
