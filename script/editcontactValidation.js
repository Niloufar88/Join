/**
 * Reference to the Edit Contact Popup DOM element.
 * Used to toggle the edit contact popup visibility.
 * @global
 * @constant
 * @type {HTMLElement}
 */

const editContactPopupEl = document.querySelector(".edit-contact-popup");

/**
 * a function which checks all validation rules for contact email input in edit contact overlay. It first checks if the email is empty, then if it matches a valid email pattern. If any of the validations fail, it shows an appropriate error message and changes the border color of the input field to red. If all validations pass, it resets the border color and hides any error messages.
 * @returns {boolean} Returns true if all validations pass, false otherwise
 */
function editContactEmailValidation() {
  const contactEmailInput = document.getElementById("emailInput");
  const ErrorMsgBox = document.getElementById("editemailErrorMsg");
  if (!editContactEmailNullValidation()) return false;
  if (!editContactEmailPatternValidation()) return false;
  contactEmailInput.parentElement.style.borderColor = "#ccc";
  if (ErrorMsgBox) {
    ErrorMsgBox.style.visibility = "hidden";
  }
  return true;
}

/**
 * a function which checks if the email input in edit contact overlay is empty. If it is empty, it shows an error message and changes the border color of the input field to red.
 * @returns {boolean} Returns true if email is not empty, false if empty
 */
function editContactEmailNullValidation() {
  const contactEmail = document
    .getElementById("emailInput")
    .value.trim()
    .toLowerCase();
  const contactEmailInput = document.getElementById("emailInput");
  const ErrorMsgBox = document.getElementById("editemailErrorMsg");
  if (!contactEmail) {
    if (ErrorMsgBox) {
      ErrorMsgBox.style.visibility = "visible";
      ErrorMsgBox.textContent = "Email cannot be empty.";
    }
    contactEmailInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
  return true;
}

/**
 * a function which checks if the email input in edit contact overlay matches a valid email pattern using a regular expression. If it does not match, it shows an error message and changes the border color of the input field to red.
 * @returns {boolean} Returns true if email matches the pattern, false otherwise
 */
function editContactEmailPatternValidation() {
  const contactEmail = document
    .getElementById("emailInput")
    .value.trim()
    .toLowerCase();
  const contactEmailInput = document.getElementById("emailInput");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const ErrorMsgBox = document.getElementById("editemailErrorMsg");
  if (!emailRegex.test(contactEmail)) {
    if (ErrorMsgBox) {
      ErrorMsgBox.style.visibility = "visible";
      ErrorMsgBox.textContent = "Please enter a valid email address.";
    }
    contactEmailInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
  return true;
}

/**
 * a function which displays an error message in the edit contact overlay. It sets the visibility of the error message box to visible and updates its text content with the provided message.
 * @param {string} message - The error message to display
 */
function editContactErrorMsg(message) {
  const ErrorMsgBox = document.getElementById("editValidationErrorMsg");
  if (ErrorMsgBox) {
    ErrorMsgBox.style.visibility = "visible";
    ErrorMsgBox.textContent = message;
  }
}

/**
 * a function which name validation by calling editContactNameNullValidation to check if the name is empty. If it is empty, it shows an error message and changes the border color of the input field to red. If the name is not empty, it resets the border color and hides any error messages.
 * @returns {boolean} Returns true if name is not empty, false if empty
 */
function editContactNameValidation() {
  const nameInput = document.getElementById("nameInput");
  const ErrorMsgBox = document.getElementById("editnameErrorMsg");
  if (!editContactNameNullValidation()) return false;
  nameInput.parentElement.style.borderColor = "#ccc";
  if (ErrorMsgBox) {
    ErrorMsgBox.style.visibility = "hidden";
  }
  return true;
}

/**
 * a function which checks if the name input in edit contact overlay is empty. If it is empty, it shows an error message and changes the border color of the input field to red.
 * @returns {boolean} Returns true if name is not empty, false if empty
 */
function editContactNameNullValidation() {
  const contactName = document
    .getElementById("nameInput")
    .value.trim()
    .toLowerCase();
  const nameInput = document.getElementById("nameInput");
  const ErrorMsgBox = document.getElementById("editnameErrorMsg");
  if (!contactName) {
    if (ErrorMsgBox) {
      ErrorMsgBox.style.visibility = "visible";
      ErrorMsgBox.textContent = "Name cannot be empty.";
    }
    nameInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
  return true;
}

/**
 * a function which saves variables for later use.
 * @returns {Object} Returns an object containing the contact name and name input element
 */
function editExistingNameValidationVariables() {
  const contactName = document
    .getElementById("nameInput")
    .value.trim()
    .toLowerCase();
  const nameInput = document.getElementById("nameInput");
  return { contactName, nameInput };
}

/**
 * a function which handles the error when the contact name already exists in Firebase. It shows an error message and changes the border color of the input field to red.
 */
function editExistingNameValidtionErrorHandling() {
  const ErrorMsgBox = document.getElementById("editnameErrorMsg");
  if (ErrorMsgBox) {
    ErrorMsgBox.style.visibility = "visible";
    ErrorMsgBox.textContent = "Contact with this name already exists.";
  }
}

/**
 * a function which fetches existing contact names from Firebase and returns them as an array. It uses the fetchExistingContactName function to get the data and maps it to extract only the names.
 */
async function editExistingNameValidation() {
  const { contactName, nameInput } = editExistingNameValidationVariables();
  try {
    const existingUserNames = await fetchExistingContactName();
    if (
      existingUserNames.find(
        (existingName) => existingName.toLowerCase() === contactName,
      )
    ) {
      editExistingNameValidtionErrorHandling();
      nameInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
      return false;
    }
    nameInput.parentElement.style.borderColor = "#ccc";
    return true;
  } catch (error) {
    console.error("Error validating name:", error);
    return true;
  }
}

/**
 * a function shich checks all validation rules for contact phone input in edit contact overlay. It first checks if the phone number is empty, then if it matches a valid phone number pattern using regular expression. If any of the validations fail, it shows an appropriate error message and changes the border color of the input field to red. If all validations pass, it resets the border color and hides any error messages.
 * @returns {boolean} Returns true if all validations pass, false otherwise
 */
function editContactPhoneValidation() {
  const phoneInput = document.getElementById("phoneInput");
  const ErrorMsgBox = document.getElementById("editphoneErrorMsg");
  if (!editContactPhoneNullValidation()) return false;
  if (!editContactPhonePatternValidation()) return false;
  phoneInput.parentElement.style.borderColor = "#ccc";
  if (ErrorMsgBox) {
    ErrorMsgBox.style.visibility = "hidden";
  }
  return true;
}

/**
 * a function which checks if the phone input in edit contact overlay is empty. If it is empty, it shows an error message and changes the border color of the input field to red.
 * @returns {boolean} Returns true if phone input is not empty, false otherwise
 */
function editContactPhoneNullValidation() {
  const contactPhone = document.getElementById("phoneInput").value.trim();
  const phoneInput = document.getElementById("phoneInput");
  const ErrorMsgBox = document.getElementById("editphoneErrorMsg");
  if (!contactPhone) {
    if (ErrorMsgBox) {
      ErrorMsgBox.style.visibility = "visible";
      ErrorMsgBox.textContent = "Phone number cannot be empty.";
    }
    phoneInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
  return true;
}

/**
 * a function which checks if the phone input in edit contact overlay matches a valid phone number pattern using a regular expression. If it does not match, it shows an error message and changes the border color of the input field to red.
 * @returns {boolean} Returns true if phone input matches the pattern, false otherwise
 */
function editContactPhonePatternValidation() {
  const contactPhone = document.getElementById("phoneInput").value.trim();
  const phoneInput = document.getElementById("phoneInput");
  const phoneRegex = /^\+?[0-9\s\-()]{7,}$/;
  const ErrorMsgBox = document.getElementById("editphoneErrorMsg");
  if (!phoneRegex.test(contactPhone)) {
    if (ErrorMsgBox) {
      ErrorMsgBox.style.visibility = "visible";
      ErrorMsgBox.textContent = "Invalid phone number format.";
    }
    phoneInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    return false;
  }
  return true;
}

/**
 * a function which handles the error when the contact name already exists in Firebase. It shows an error message and changes the border color of the input field to red.
 */
function validateEditContactFormErrorHandling() {
  const ErrorMsgBox = document.querySelectorAll(".editValidationErrorMsg");
  if (ErrorMsgBox) {
    ErrorMsgBox.forEach((msgBox) => {
      msgBox.style.visibility = "hidden";
    });
  }
}

/**
 * a function which checks all validation rules for contact name, email and phone inputs in edit contact overlay. It calls individual validation functions for each input and combines their results to determine if all validations pass. If all validations pass, it hides any error messages. It returns true if all validations pass, false otherwise.
 * @returns {boolean} Returns true if all validations pass, false otherwise
 */
function validateEditContactForm() {
  validateEditContactFormErrorHandling();
  const isNameValid = editContactNameValidation();
  const isEmailValid = editContactEmailValidation();
  const isPhoneValid = editContactPhoneValidation();
  const allValid = isNameValid && isEmailValid && isPhoneValid;
  if (allValid) {
    validateEditContactFormErrorHandling();
    return allValid;
  }
  return false;
}

/**
 * an add event listener to the edit contact popup element which listens for click events. If the user clicks outside the content area of the popup (i.e., on the overlay), it calls the closeEditContactOverlay function to close the popup.
 */
editContactPopupEl.addEventListener("click", (e) => {
  if (e.target === editContactPopupEl) {
    closeEditContactOverlay();
  }
});
