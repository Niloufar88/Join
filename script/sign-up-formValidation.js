/**
 * signup Validation functions, which checks for empty fields, validates the name, email, password and confirm password inputs. If any validation fails, it shows an appropriate error message and highlights the relevant input fields in red.
 * @returns {Promise<boolean>} - Returns true if all validations pass, false otherwise.
 */

async function signupValidation() {
  const isNullCheckValid = nullCheckValidation();
  const isNameValid = await nameValidation();
  const isEmailValid = await emailValidation();
  const isPasswordValid = passwordValidation();
  const isConfirmPasswordValid = confirmPasswordValidation();
  if (
    !isNullCheckValid ||
    !isNameValid ||
    !isEmailValid ||
    !isPasswordValid ||
    !isConfirmPasswordValid
  ) {
    if (
      isNullCheckValid &&
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      confirmPasswordErrorMessage(
        "something went wrong. check the fields and try again.",
      );
    }
    return false;
  } else {
    resetBorderColors();
    const errorMsg = document.getElementById("confirmpassword-error-message");
    errorMsg.style.visibility = "hidden";
    return true;
  }
}

/**
 * This function checks if any of the input fields are empty. If so, it highlights the empty fields in red and displays an error message prompting the user to fill in all fields.
 * @returns {boolean} - Returns true if all fields are filled, false otherwise.
 */
function nullCheckValidation() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document
    .getElementById("signup-confirm-password")
    .value.trim();
  resetBorderColors();
  if (!name || !email || !password || !confirmPassword) {
    inputBorderColorsRed();
    return false;
  }
  return true;
}

/**
 * a function which highlights the input fields with red borders if they are empty.
 */

function borderColorVariables() {
  const passwordContainer =
    document.getElementById("signup-password").parentElement;
  const confirmPasswordContainer = document.getElementById(
    "signup-confirm-password",
  ).parentElement;
  return { passwordContainer, confirmPasswordContainer };
}

function inputBorderColorsRed() {
  const nameContainer = document.getElementById("signup-name").parentElement;
  const emailContainer = document.getElementById("signup-email").parentElement;
  const { passwordContainer, confirmPasswordContainer } =
    borderColorVariables();
  if (!document.getElementById("signup-name").value.trim())
    nameContainer.style.borderColor = "rgb(170, 22, 22)";
  if (!document.getElementById("signup-email").value.trim())
    emailContainer.style.borderColor = "rgb(170, 22, 22)";
  if (!document.getElementById("signup-password").value.trim())
    passwordContainer.style.borderColor = "rgb(170, 22, 22)";
  if (!document.getElementById("signup-confirm-password").value.trim())
    confirmPasswordContainer.style.borderColor = "rgb(170, 22, 22)";
}

/**
 * a function which sets the border color of the input fields back to the default color (#ccc) when the user starts typing in the fields or when they are not empty anymore.
 */
function resetBorderColors() {
  const nameContainer = document.getElementById("signup-name").parentElement;
  const emailContainer = document.getElementById("signup-email").parentElement;
  const passwordContainer =
    document.getElementById("signup-password").parentElement;
  const confirmPasswordContainer = document.getElementById(
    "signup-confirm-password",
  ).parentElement;
  nameContainer.style.borderColor = "#ccc";
  emailContainer.style.borderColor = "#ccc";
  passwordContainer.style.borderColor = "#ccc";
  confirmPasswordContainer.style.borderColor = "#ccc";
}

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
 * an async function which checks if the name is already taken in Firebase by fetching the existing user names and comparing them with the input name. If the name is already taken, it shows an error message and highlights the name input field in red.
 * @returns {Promise<boolean>} Returns true if name is available, false if already taken
 */

function existingNameFetchVariables() {
  const name = document
    .getElementById("signup-name")
    .value.trim()
    .toLowerCase();
  const nameInput = document.getElementById("signup-name");
  return { name, nameInput };
}

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
 * an async function which checks if the email is already registered in Firebase by fetching the existing user emails and comparing them with the input email. If the email is already registered, it shows an error message and clears the input field.
 * @returns {Promise<boolean>} Returns true if email is available, false if already exists
 */

function existingEmailFetchVariables() {
  const email = document
    .getElementById("signup-email")
    .value.trim()
    .toLowerCase();
  const emailInput = document.getElementById("signup-email");
  return { email, emailInput };
}

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
 * confirmation password validation function which checks if the confirm password input matches the password input. If they don't match, it shows an error message and clears the confirm password input field.
 * @returns {boolean} - Returns true if the confirm password matches the password, false otherwise.
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
 * a function which triggers the registration process in Firebase if all the validation checks pass successfully. It retrieves the values from the input fields and calls the registerUser function, which is responsible for creating a new user account in Firebase with the provided name, email, and password.
 * @returns {Promise<void>} - Returns a promise that resolves when the registration process is complete.
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
    console.error("Registration error:", error);
    confirmPasswordErrorMessage("Registration failed. Please try again.");
    submitBtn.disabled = !policyCheckbox.checked;
    submitBtn.textContent = "Sign up";
  }
}
