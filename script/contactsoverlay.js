const addContactPopupEl = document.querySelector(".add-contact-popup");

/**
 * an async function which checks all validation rules for contact email input in add contact overlay. It first checks if the email is empty, then if it matches a valid email pattern, and finally if the email is already registered in Firebase. If any of the validations fail, it shows an appropriate error message and changes the border color of the input field to red. If all validations pass, it resets the border color and hides any error messages.
 * @returns {Promise<boolean>} Returns true if all validations pass, false otherwise
 */
async function contactEmailValidation() {
  const contactEmailInput = document.getElementById("email_input");
  const ErrorMsgBox = document.getElementById("contactemailErrorMsg");
  if (!contactOverlayEmailNullValidation()) return false;
  if (!contactOverlayEmailPatternValidation()) return false;
  const isEmailAvailable = await existingEmailValidation();
  if (!isEmailAvailable) {
    return false;
  }
  contactEmailInput.parentElement.style.borderColor = "#ccc";
  if (ErrorMsgBox) {
    ErrorMsgBox.style.visibility = "hidden";
  }
  return true;
}

/**
 * a function which checks if the email input is empty. If it is empty, it shows an error message and changes the border color of the input field to red.
 * @returns {boolean} Returns true if email is not empty, false if empty
 */
function contactOverlayEmailNullValidation() {
  const contactEmail = document
    .getElementById("email_input")
    .value.trim()
    .toLowerCase();
  const contactEmailInput = document.getElementById("email_input");
  const ErrorMsgBox = document.getElementById("contactemailErrorMsg");
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
 * a function which checks if the email input matches a valid email pattern using a regular expression. If it does not match, it shows an error message and changes the border color of the input field to red.
 * @returns {boolean} Returns true if email matches the pattern, false if not
 */
function contactOverlayEmailPatternValidation() {
  const contactEmail = document
    .getElementById("email_input")
    .value.trim()
    .toLowerCase();
  const contactEmailInput = document.getElementById("email_input");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const ErrorMsgBox = document.getElementById("contactemailErrorMsg");
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
 * an async function which checks if the email is already registered in Firebase by fetching the existing user emails and comparing them with the input email. If the email is already registered, it shows an error message and clears the input field.
 * @returns {Promise<boolean>} Returns true if email is available, false if already exists
 */

function existingEmailValidationVariables() {
  const contactEmail = document
    .getElementById("email_input")
    .value.trim()
    .toLowerCase();
  const emailInput = document.getElementById("email_input");
  return { contactEmail, emailInput };
}

function existingEmailValidationErrorHandling() {
  const errorMsg = document.getElementById("contactemailErrorMsg");
  if (errorMsg) {
    errorMsg.style.visibility = "visible";
    errorMsg.textContent = "Contact with this email already exists.";
  }
}

async function existingEmailValidation() {
  const { contactEmail, emailInput } = existingEmailValidationVariables();
  try {
    const existingContactEmails = await fetchExistingContactEmail();
    if (
      existingContactEmails.find(
        (existingEmail) => existingEmail.toLowerCase() === contactEmail,
      )
    ) {
      existingEmailValidationErrorHandling();
      emailInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
      return false;
    }
    return true;
  } catch (error) {
    return true;
  }
}

/**
 * an async function which checks all validation rules for contact name input in add contact overlay. It first checks if the name is empty, then if the name is already exists in Firebase. If any of the validations fail, it shows an appropriate error message and changes the border color of the input field to red. If all validations pass, it resets the border color and hides any error messages.
 * @returns {boolean} - Returns true if the name is valid, false otherwise.
 */

async function contactNameValidation() {
  const nameInput = document.getElementById("name_input");
  const ErrorMsgBox = document.getElementById("contactnameErrorMsg");
  if (!contactNameNullValidation()) return false;
  const isNameAvailable = await existingNameValidation();
  if (!isNameAvailable) {
    return false;
  }
  if (ErrorMsgBox) ErrorMsgBox.style.visibility = "hidden";
  nameInput.parentElement.style.borderColor = "#ccc";
  return true;
}

/**
 * a function which checks if the name input is empty. If it is empty, it shows an error message and changes the border color of the input field to red.
 * @returns {boolean} Returns true if name is not empty, false if empty
 */
function contactNameNullValidation() {
  const contactName = document
    .getElementById("name_input")
    .value.trim()
    .toLowerCase();
  const nameInput = document.getElementById("name_input");
  const ErrorMsgBox = document.getElementById("contactnameErrorMsg");
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
 * an async function which checks if the contact name is already exists in Firebase by fetching the existing contact names and comparing them with the input name. If the contact name is already exists, it shows an error message and clears the input field.
 * @returns {Promise<boolean>} Returns true if name is available, false if already taken
 */

function existingNameValidationVariables() {
  const contactName = document
    .getElementById("name_input")
    .value.trim()
    .toLowerCase();
  const nameInput = document.getElementById("name_input");
  return { contactName, nameInput };
}

function existingNameValidationErrorHandling() {
  const ErrorMsgBox = document.getElementById("contactnameErrorMsg");
  if (ErrorMsgBox) {
    ErrorMsgBox.style.visibility = "visible";
    ErrorMsgBox.textContent = "Contact with this name already exists.";
  }
}

async function existingNameValidation() {
  const { contactName, nameInput } = existingNameValidationVariables();
  try {
    const existingUserNames = await fetchExistingContactName();
    if (
      existingUserNames.find(
        (existingName) => existingName.toLowerCase() === contactName,
      )
    ) {
      existingNameValidationErrorHandling();
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
 * a function which checks all validation rules for contact phone input in add contact overlay. It first checks if the phone number is empty, then if it matches a valid phone number pattern. If any of the validations fail, it shows an appropriate error message and changes the border color of the input field to red. If all validations pass, it resets the border color and hides any error messages.
 * @returns {boolean} Returns true if all validations pass, false otherwise
 */
function contactPhoneValidation() {
  const phoneInput = document.getElementById("phone_input");
  const ErrorMsgBox = document.getElementById("contactphoneErrorMsg");
  if (!contactPhoneNullValidation()) return false;
  if (!contactPhonePatternValidation()) return false;
  if (ErrorMsgBox) {
    ErrorMsgBox.style.visibility = "hidden";
  }
  phoneInput.parentElement.style.borderColor = "#ccc";
  return true;
}

/**
 * a function which checks if the phone number input is empty. If it is empty, it shows an error message and changes the border color of the input field to red.
 * @returns {boolean} Returns true if phone number is not empty, false if empty
 */
function contactPhoneNullValidation() {
  const contactPhone = document.getElementById("phone_input").value.trim();
  const phoneInput = document.getElementById("phone_input");
  const ErrorMsgBox = document.getElementById("contactphoneErrorMsg");
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
 * a function which checks if the phone number input matches a valid phone number pattern using a regular expression. If it does not match, it shows an error message and changes the border color of the input field to red.
 * @returns {boolean} Returns true if phone number matches the pattern, false otherwise
 */
function contactPhonePatternValidation() {
  const contactPhone = document.getElementById("phone_input").value.trim();
  const phoneInput = document.getElementById("phone_input");
  const ErrorMsgBox = document.getElementById("contactphoneErrorMsg");
  const phoneRegex = /^\+?[0-9\s\-()]{7,}$/;
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
 * a function which validates the entire contact form by checking the name, email, and phone number inputs. It first hides any existing error messages, then performs individual validations for each input. If all validations pass, it hides all error messages.
 * @returns {boolean} Returns true if all validations pass, false otherwise
 */
async function validateContactForm() {
  validateContactFormErrorHandling();
  const isNameValid = await contactNameValidation();
  const isEmailValid = await contactEmailValidation();
  const isPhoneValid = contactPhoneValidation();
  const allValid = isNameValid && isEmailValid && isPhoneValid;
  const ErrorMsgBox = document.querySelectorAll(".contactValidationErrorMsg");
  if (allValid && ErrorMsgBox) {
    ErrorMsgBox.forEach((msgBox) => {
      msgBox.style.visibility = "hidden";
    });
  }
  return allValid;
}

/**
 * a function which hides all error messages in the contact form by setting their visibility to hidden. It selects all elements with the class "contactValidationErrorMsg" and iterates through them to hide each one.
 */
function validateContactFormErrorHandling() {
  const ErrorMsgBox = document.querySelectorAll(".contactValidationErrorMsg");
  if (ErrorMsgBox) {
    ErrorMsgBox.forEach((msgBox) => {
      msgBox.style.visibility = "hidden";
    });
  }
}

/**
 * a function which closes the add contact popup overlay by setting its display style to "none". It is called when the user clicks outside the popup content area.
 */
addContactPopupEl.addEventListener("click", (e) => {
  if (e.target === addContactPopupEl) {
    closePopupOverlay();
  }
});

/**
 * a function which checks if the edited contact name is valid for saving. It validates the name input and shows an error message if the name is empty.
 * @returns {boolean} Returns true if the name is valid, false otherwise
 */
function isNameValidForSave() {
  const nameError = document.getElementById("editnameErrorMsg");
  const isNameValid = editContactNameValidation();
  if (!isNameValid) {
    if (nameError) {
      nameError.style.visibility = "visible";
      nameError.textContent = "Name cannot be empty.";
    }
    return;
  }
}

/**
 * a function which checks if the edited contact email is valid for saving. It validates the email input and shows an error message if the email is empty or does not match a valid pattern.
 * @returns {boolean} Returns true if the email is valid, false otherwise
 */
function isEmailValidForSave() {
  const emailError = document.getElementById("editemailErrorMsg");
  const isEmailValid = editContactEmailValidation();
  if (!isEmailValid) {
    if (emailError) {
      emailError.style.visibility = "visible";
      emailError.textContent = "Please check Email input data.";
    }
    return;
  }
}

/**
 * a function which checks if the edited contact phone number is valid for saving. It validates the phone input and shows an error message if the phone number is empty or does not match a valid pattern.
 * @returns {boolean} Returns true if the phone number is valid, false otherwise
 */
function isPhoneValidForSave() {
  const phoneError = document.getElementById("editphoneErrorMsg");
  const isPhoneValid = editContactPhoneValidation();
  if (!isPhoneValid) {
    if (phoneError) {
      phoneError.style.visibility = "visible";
      phoneError.textContent = "Please check Phone input data.";
    }
    return;
  }
}

/**
 * a function which hides all error messages in the edit contact form by setting their visibility to hidden. It selects the error message elements for name, email, and phone inputs and hides each one if it exists.
 */
function dataErrorForSave() {
  const nameError = document.getElementById("editnameErrorMsg");
  const emailError = document.getElementById("editemailErrorMsg");
  const phoneError = document.getElementById("editphoneErrorMsg");
  if (nameError) nameError.style.visibility = "hidden";
  if (emailError) emailError.style.visibility = "hidden";
  if (phoneError) phoneError.style.visibility = "hidden";
}

/**
 * a function which checks all the validation rules. if invalid it executes the functions to show error messages for each invalid input. if all inputs are valid, it allows the save operation to proceed.
 * @returns {boolean} Returns true if all inputs are valid, false otherwise
 */
function isDataValidForSave() {
  dataErrorForSave();
  const isValid = validateEditContactForm();
  if (!isValid) {
    isNameValidForSave();
    isEmailValidForSave();
    isPhoneValidForSave();
    return;
  }
}

/**
 * a nasync functin which loads the database, updates the contact list, closes the edit contact overlay, hides the container, and shows a popup message on successful save. It is called after successfully updating the contact in Firebase to refresh the displayed data and provide feedback to the user.
 */
async function essentialFunctionsForSave() {
  await loadDataBase();
  await createContactList();
  closeEditContactOverlay();
  container.classList.add("d-none");
  if (window.innerWidth > 450) {
    popupMessage("Contact successfully saved!");
  } else {
    contactSection.style.display = "block";
    contactDashboard.style.display = "none";
  }
}

/**
 *  a function which checks if the contact name, email, and phone number inputs in the edit contact form are valid by calling their respective validation functions. It returns true if all inputs are valid, false otherwise.
 * @returns {Object|null} Returns an object containing contactId and updatedContact if valid, null otherwise
 */
function prepareEditedContactData() {
  isDataValidForSave();
  const editedData = getEditedContactData();
  const contactId = findContactIdFromDisplayed();
  if (!contactId) {
    editContactErrorMsg("Contact not found");
    return null;
  }
  const initials = getInitials(editedData.editedName);
  const contactColor = fetchedData[contactId].color;
  return {
    contactId,
    updatedContact: {
      name: editedData.editedName,
      email: editedData.editedEmail,
      phone: editedData.editedPhone,
      initials: initials,
      color: contactColor,
      checked: false,
    },
  };
}

/**
 * an async function which updated the data in firebase and after that executes the essential functions to refresh the data and show popup message.
 * @param {string} contactId
 * @param {Object} updatedContact
 */
async function updateAndRefreshContact(contactId, updatedContact) {
  try {
    await updateContactInFirebase(contactId, updatedContact);
    await essentialFunctionsForSave();
  } catch (error) {
    console.error("Error saving edited contact:", error);
  }
}

/**
 * an async function which gets the prepared data from the edit contact form, validates it, and updates the contact in Firebase if valid.
 * @returns {Promise<void>}
 */
async function saveEditedContact() {
  const contactData = prepareEditedContactData();
  if (!contactData) return;
  const { contactId, updatedContact } = contactData;
  await updateAndRefreshContact(contactId, updatedContact);
}
