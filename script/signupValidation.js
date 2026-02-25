/**
 * signup Validation functions, which checks for empty fields, validates the name, email, password and confirm password inputs. If any validation fails, it shows an appropriate error message and highlights the relevant input fields in red.
 * @returns {Promise<boolean>} - Returns true if all validations pass, false otherwise.
 */

async function performAllValidations() {
  const isNullCheckValid = nullCheckValidation();
  const isNameValid = await nameValidation();
  const isEmailValid = await emailValidation();
  const isPasswordValid = passwordValidation();
  const isConfirmPasswordValid = confirmPasswordValidation();
  return {
    isNullCheckValid,
    isNameValid,
    isEmailValid,
    isPasswordValid,
    isConfirmPasswordValid,
  };
}

/**
 * a function which takes the results of all the validation functions and checks if they are all valid. If all validations pass, it resets the border colors of the input fields and hides any error messages, then returns true. If any validation fails, it returns false.
 * @param {Object} results - An object containing the results of all validation functions.
 * @returns {boolean} - Returns true if all validations pass, false otherwise.
 */
function handleValidationResults(results) {
  const {
    isNullCheckValid,
    isNameValid,
    isEmailValid,
    isPasswordValid,
    isConfirmPasswordValid,
  } = results;
  const allValid =
    isNullCheckValid &&
    isNameValid &&
    isEmailValid &&
    isPasswordValid &&
    isConfirmPasswordValid;
  if (allValid) {
    resetBorderColors();
    const errorMsg = document.getElementById("confirmpassword-error-message");
    errorMsg.style.visibility = "hidden";
    return true;
  }
  return false;
}

/**
 * a function which executes performAllValidation and handleValidationResults functions to validate the signup form and returns the final result of the validation process.
 * @returns {Promise<boolean>} - Returns true if all validations pass, false otherwise.
 */
async function signupValidation() {
  const validationResults = await performAllValidations();
  return handleValidationResults(validationResults);
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
 * a function which saves the input data into variables and return them as an object.
 * @returns {Object} - Returns an object containing the password and confirm password container elements.
 */
function borderColorVariables() {
  const passwordContainer =
    document.getElementById("signup-password").parentElement;
  const confirmPasswordContainer = document.getElementById(
    "signup-confirm-password",
  ).parentElement;
  return { passwordContainer, confirmPasswordContainer };
}

/**
 * a function which highlights the input fields with red borders if they are empty.
 */
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
