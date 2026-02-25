/**
 * a function which checks all the name validation rules: it checks if the name is empty, if it contains numbers, and if it already exists in Firebase. If any of these checks fail, it shows an appropriate error message and highlights the name input field in red.
 * @returns {boolean} - Returns true if the name is valid, false otherwise.
 */
async function nameValidation() {
  const nameInput = document.getElementById("signup-name");
  if (!nameNullValidation()) return false;
  if (!nameNumberContainValidation()) return false;
  const isNameAvailable = await existingNameValidation();
  if (!isNameAvailable) {
    nameInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
  const errorMsg = document.getElementById("name-error-message");
  errorMsg.style.visibility = "hidden";
  nameInput.parentElement.style.borderColor = "#ccc";
  return true;
}

/**
 * a function which checks if the name input is empty. If it is, it shows an error message and highlights the name input field in red.
 * @returns {boolean} - Returns true if the name is not empty, false otherwise.
 */
function nameNullValidation() {
  const name = document
    .getElementById("signup-name")
    .value.trim()
    .toLowerCase();
  const nameInput = document.getElementById("signup-name");
  if (!name) {
    nameErrorMessage("Name cannot be empty.");
    nameInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
  return true;
}

/**
 * a function which checks if the name input contains any numbers. If it does, it shows an error message and highlights the name input field in red.
 * @returns {boolean} - Returns true if the name does not contain numbers, false otherwise.
 */
function nameNumberContainValidation() {
  const name = document
    .getElementById("signup-name")
    .value.trim()
    .toLowerCase();
  const nameInput = document.getElementById("signup-name");
  if (/[0-9]/.test(name)) {
    nameErrorMessage("Name cannot contain numbers.");
    nameInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
  return true;
}

/**
 * a function which saves the value from the name input field into a variable and returns it as an object.
 * @returns {Object} - Returns an object containing the name and the name input element.
 */
function existingNameFetchVariables() {
  const name = document
    .getElementById("signup-name")
    .value.trim()
    .toLowerCase();
  const nameInput = document.getElementById("signup-name");
  return { name, nameInput };
}

/**
 * an async function which checks if the name is already taken in Firebase by fetching the existing user names and comparing them with the input name. If the name is already taken, it shows an error message and highlights the name input field in red.
 * @returns {Promise<boolean>} Returns true if name is available, false if already taken
 */
async function existingNameValidation() {
  const { name, nameInput } = existingNameFetchVariables();
  try {
    const existingUserNames = await fetchExistingUserName();
    if (
      existingUserNames.find(
        (existingName) => existingName.toLowerCase() === name,
      )
    ) {
      nameErrorMessage("User with name already exists.");
      nameInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error validating name:", error);
    return true;
  }
}

/**
 * an async function which checks all the email validation rules: it checks if the email is empty, if it matches a basic email format, and if it already exists in Firebase. If any of these checks fail, it shows an appropriate error message and highlights the email input field in red.
 * @returns {boolean} - Returns true if the email is valid, false otherwise.
 */
async function emailValidation() {
  const emailInput = document.getElementById("signup-email");
  if (!emailNullValidation()) return false;
  if (!emailPatternValidation()) return false;
  const isEmailAvailable = await existingEmailValidation();
  if (!isEmailAvailable) {
    return false;
  }
  const errorMsg = document.getElementById("email-error-message");
  errorMsg.style.visibility = "hidden";
  emailInput.parentElement.style.borderColor = "#ccc";
  return true;
}

/**
 * a function which checks if the email input is empty. If it is, it shows an error message and highlights the email input field in red.
 * @returns {boolean} - Returns true if the email is not empty, false otherwise.
 */
function emailNullValidation() {
  const email = document
    .getElementById("signup-email")
    .value.trim()
    .toLowerCase();
  const emailInput = document.getElementById("signup-email");
  if (!email) {
    emailErrorMessage("Email cannot be empty.");
    emailInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
  return true;
}

/**
 * a function which checks if the email input matches a basic email format using a regular expression. If the email is invalid, it shows an error message and highlights the email input field in red.
 * @returns {boolean} - Returns true if the email is valid, false otherwise.
 */
function emailPatternValidation() {
  const email = document
    .getElementById("signup-email")
    .value.trim()
    .toLowerCase();
  const emailInput = document.getElementById("signup-email");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailErrorMessage("Please enter a valid email address.");
    emailInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
  return true;
}

/**
 * a function which saves the value from the email input field into a variable and returns it as an object.
 * @returns {Object} - Returns an object containing the email and the email input element.
 */
function existingEmailFetchVariables() {
  const email = document
    .getElementById("signup-email")
    .value.trim()
    .toLowerCase();
  const emailInput = document.getElementById("signup-email");
  return { email, emailInput };
}

/**
 * an async function which checks if the email is already registered in Firebase by fetching the existing user emails and comparing them with the input email. If the email is already registered, it shows an error message and clears the input field.
 * @returns {Promise<boolean>} Returns true if email is available, false if already exists
 */
async function existingEmailValidation() {
  const { email, emailInput } = existingEmailFetchVariables();
  try {
    const existingUserEmails = await fetchExistingUserEmail();
    if (
      existingUserEmails.find(
        (existingEmail) => existingEmail.toLowerCase() === email,
      )
    ) {
      emailErrorMessage("This email is already registered.");
      emailInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error validating email:", error);
    return true;
  }
}

/**
 * a function which checks all the password validation rules: it checks if the password is empty, if it is at least 6 characters long, and if it does not contain spaces. If any of these checks fail, it shows an appropriate error message and highlights the password input field in red.
 * @returns {boolean} - Returns true if the password is valid, false otherwise.
 */
function passwordValidation() {
  const passwordInput = document.getElementById("signup-password");
  if (!passwordNullValidation()) return false;
  if (!passwordSpaceValidation()) return false;
  const errorMsg = document.getElementById("password-error-message");
  errorMsg.style.visibility = "hidden";
  passwordInput.parentElement.style.borderColor = "#ccc";
  return true;
}

/**
 * a function which checks if the password input is empty or less than 6 characters long. If it is, it shows an error message and highlights the password input field in red.
 * @returns {boolean} - Returns true if the password is not empty and at least 6 characters long, false otherwise.
 */
function passwordNullValidation() {
  const password = document.getElementById("signup-password").value.trim();
  const passwordInput = document.getElementById("signup-password");
  if (password.length < 6) {
    passwordErrorMessage("Password must be at least 6 characters long.");
    passwordInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
  return true;
}

/**
 * a function which checks if the password input contains any spaces. If it does, it shows an error message and highlights the password input field in red.
 * @returns {boolean} - Returns true if the password does not contain spaces, false otherwise.
 */
function passwordSpaceValidation() {
  const password = document.getElementById("signup-password").value.trim();
  const passwordInput = document.getElementById("signup-password");
  if (/\s/.test(password)) {
    passwordErrorMessage("Password cannot contain spaces.");
    passwordInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
  return true;
}

/**
 * a function which saves the values from the password and confirm password input fields into variables and returns them as an object.
 * @returns {Object} - Returns an object containing the password, confirm password, and the confirm password input element.
 */

function confirmpasswordVariables() {
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document
    .getElementById("signup-confirm-password")
    .value.trim();
  const confirmPasswordInput = document.getElementById(
    "signup-confirm-password",
  );
  return { password, confirmPassword, confirmPasswordInput };
}

/**
 * confirmation password validation function which checks if the confirm password input matches the password input. If they don't match, it shows an error message and clears the confirm password input field.
 * @returns {boolean} - Returns true if the confirm password matches the password, false otherwise.
 */
function confirmPasswordValidation() {
  const { password, confirmPassword, confirmPasswordInput } =
    confirmpasswordVariables();
  if (!confirmpasswordMatchValidation()) return false;
  if (confirmPassword.length >= 6 && password === confirmPassword) {
    const errorMsg = document.getElementById("confirmpassword-error-message");
    errorMsg.style.visibility = "hidden";
    confirmPasswordInput.parentElement.style.borderColor = "#29abe2";
    checkboxAcceptance.style.visibility = "visible";
    checkboxAcceptance.textContent = "privacy policy must be accepted.";
    return true;
  }
}

/**
 * a function which checks if the confirm password input matches the password input. If they don't match, it shows an error message and highlights the confirm password input field in red.
 * @returns {boolean} - Returns true if the confirm password matches the password, false otherwise.
 */
function confirmpasswordMatchValidation() {
  const { password, confirmPassword, confirmPasswordInput } =
    confirmpasswordVariables();
  if (password !== confirmPassword) {
    confirmPasswordErrorMessage(
      "Your passwords don't match. Please try again.",
    );
    confirmPasswordInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
  return true;
}

/**
 * a function which checks if the confirm password input is empty. If it is, it shows an error message and highlights the confirm password input field in red.
 * @returns {boolean} - Returns true if the confirm password is not empty, false otherwise.
 */
function nullConfirmationPasswordValidation() {
  const confirmPassword = document
    .getElementById("signup-confirm-password")
    .value.trim();
  const confirmPasswordInput = document.getElementById(
    "signup-confirm-password",
  );
  if (!confirmPassword) {
    confirmPasswordErrorMessage("please confirm your password.");
    confirmPasswordInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
}

/**
 * a function which saves the values from the input fields into variables and returns them as an object. It also hashes the password before returning it.
 * @returns {Promise<Object>} - Returns a promise that resolves to an object containing the name, email, and hashed password.
 */
async function fetchVariables() {
  const name = document
    .getElementById("signup-name")
    .value.trim()
    .toLowerCase();
  const email = document
    .getElementById("signup-email")
    .value.trim()
    .toLowerCase();
  const password = document.getElementById("signup-password").value.trim();
  const hashedPassword = await hashPassword(password);
  return { name, email, hashedPassword };
}

/**
 * an async function which performs the registration process by first validating the form, then fetching the input values, hashing the password, and finally registering the user in Firebase. If the registration is successful, it shows a success message and redirects to the login page after a short delay. If there is an error during registration, it shows an error message and re-enables the submit button.
 * @returns {Promise<void>} - Returns a promise that resolves when the registration process is complete.
 */
async function signupRegistrationInFirebase() {
  if (!(await signupValidation())) return;
  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "wait...";
    const { name, email, hashedPassword } = await fetchVariables();
    await registerUser(name, email, hashedPassword);
    showSuccessMessage();
    resetPageDefaults();
    setTimeout(() => {
      window.location.href = "../html/index.html";
    }, 2000);
  } catch (error) {
    confirmPasswordErrorMessage("Registration failed. Please try again.");
    submitBtn.disabled = !policyCheckbox.checked;
    submitBtn.textContent = "Sign up";
  }
}
