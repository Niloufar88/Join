const editContactPopupEl = document.querySelector(".edit-contact-popup");

/**
 * get contact data from edit overlay input fields
 * @returns {object|null} contactName and contactEmail or null if missing
 */
function findDataFromEditOverlayToDelete() {
  const nameInputEdit = document.getElementById("nameInput");
  const emailInputEdit = document.getElementById("emailInput");
  if (!nameInputEdit || !emailInputEdit) {
    console.error("Input fields not found");
    alert("Error: Input fields not found");
    return null;
  }
  const contactName = nameInputEdit.value.trim();
  const contactEmail = emailInputEdit.value.trim();
  if (!contactName || !contactEmail) return null;
  return { contactName, contactEmail };
}

/**
 * defines function to find contact and ID from edit overlay input fields
 * calls findDataFromEditOverlayToDelete to get contactName and contactEmail
 * iterates through fetchedData entries to find matching contact
 * compares name and email to find the correct contact
 * if match is found, assigns foundContact and foundId variables
 * @returns {Object|null} foundContact, foundId, contactName, contactEmail or null
 */
function foundContactUndIdEditOverlay() {
  const contactData = findDataFromEditOverlayToDelete();
  if (!contactData) return null;
  const { contactName, contactEmail } = contactData;
  for (const [id, data] of Object.entries(fetchedData)) {
    if (data.name === contactName && data.email === contactEmail) {
      return { foundContact: data, foundId: id, contactName, contactEmail };
    }
  }
  console.error("No match found in fetchedData");
  return null;
}

/**
 * * @param {Event} event
 * defines a async function to handle delete contact from edit overlay
 * defines a contactData variable to get contact name, contact email and ID
 * checks if foundContact is available
 * calls deleteContact with foundId to remove contact from Firebase
 * reloads database and updates contact list
 * closes edit contact overlay and hides container
 * shows popup message on successful deletion
 */
async function deleteContactFromEditOverlay(event) {
  const contactData = foundContactUndIdEditOverlay();
  if (!contactData) return;
  const { foundContact, foundId, contactName, contactEmail } = contactData;
  if (!foundContact) return;
  try {
    await deleteContact(foundId);
    await loadDataBase();
    await createContactList();
    closeEditContactOverlay();
    container.classList.add("d-none");
    if (window.innerWidth > 450) {
      popupMessage("Contact successfully deleted!");
    } else {
      contactSection.style.display = "block";
      contactDashboard.style.display = "none";
    }
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}

/**
 * defines function to open edit contact overlay
 * defines foundContact, foundID, and contactColor variables
 * searches for contact in fetchedData matching displayed contact details
 * checks if data.name , data.email, and data.phone match displayed values
 * if found, assigns foundContact and foundID variables
 * retrieves contact color from floating contact card (contact-symbol)
 * @returns {Object} foundContact, foundID, and contactColor
 */
function openEditContactOverlay() {
  let foundContact,
    foundID,
    contactColor = null;
  const contactSymbol = document.getElementById("contact-symbol");
  if (contactSymbol) {
    contactColor = contactSymbol.style.backgroundColor;
  }
  for (const [id, data] of Object.entries(fetchedData)) {
    if (
      data.name ===
        document.getElementById("contact-name").textContent.trim() &&
      data.email === document.getElementById("span-email").textContent.trim() &&
      data.phone === document.getElementById("span-phone").textContent.trim()
    ) {
      foundContact = data;
      foundID = id;
      break;
    }
  }
  return { foundContact, foundID, contactColor };
}

/**
 * defines function to render edit contact overlay
 * checks if foundContact is available
 * Add ID to contact object for later use in edit/delete
 * Set innerHTML FIRST, before accessing the overlay and calls openEditContactOverlay to get contact data
 * render edit contact template with found contact data and color
 * triggers slide-in animation to show overlay
 * sets input values with fallback for name, email and phone
 */

function renderEditContactOverlayMoves() {
  const overlay = editContactPopup.querySelector(".edit-contact-overlay");
  editContactPopup.classList.remove("d-none");
  overlay.offsetHeight;
  overlay.classList.remove("slide-out");
  overlay.classList.add("slide-in");
}

function renderEditContactOverlay() {
  const contactData = openEditContactOverlay();
  const { foundContact, foundID, contactColor } = contactData;
  if (foundContact) {
    foundContact.id = foundID;
    const initials = getInitials(foundContact.name);
    editContactPopup.innerHTML = renderEditContactTemplate(
      foundContact.name,
      foundContact.email,
      foundContact.phone,
      contactColor,
      initials,
    );
    renderEditContactOverlayMoves();
  }
}

/**
 * defines function to close edit contact overlay by pressing cancel button
 * checks if editContactPopup exists
 * selects overlay element within editContactPopup
 * triggers slide-out animation by modifying class list
 * adds d-none class to hide popup after animation completes (500ms)
 */
function closeEditContactOverlay() {
  if (!editContactPopup) return;
  const overlay = editContactPopup.querySelector(".edit-contact-overlay");
  if (!overlay) return;
  overlay.classList.remove("slide-in");
  overlay.classList.add("slide-out");
  setTimeout(() => {
    editContactPopup.classList.add("d-none");
  }, 500);
}

/**
 * gets input values from shown contact data in floating contact card
 * @returns {object} editedName, editedEmail, editedPhone
 */
function getEditedContactData() {
  const editedName = document.getElementById("nameInput").value.trim();
  const editedEmail = document.getElementById("emailInput").value.trim();
  const editedPhone = document.getElementById("phoneInput").value.trim();
  return { editedName, editedEmail, editedPhone };
}

/**
 * save got values in new varibales
 * making a for loop to find ID and get Data from fetchedData object
 * finds contact ID by matching currently displayed contact with fetchedData
 * @returns {string|null} contactId or null if not found
 */
function findContactIdFromDisplayed() {
  const contactName = document
    .getElementById("contact-name")
    .textContent.trim();
  const contactEmail = document.getElementById("span-email").textContent.trim();
  const contactPhone = document.getElementById("span-phone").textContent.trim();
  for (const [id, data] of Object.entries(fetchedData)) {
    if (
      data.name === contactName &&
      data.email === contactEmail &&
      data.phone === contactPhone
    )
      return id;
  }
  return null;
}

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
 * an async function which checks if the contact name is already exists in Firebase by fetching the existing contact names and comparing them with the input name. If the contact name is already exists, it shows an error message and clears the input field.
 * @returns {Promise<boolean>} Returns true if name is available, false if already taken
 */

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
  }
  return allValid;
}

editContactPopupEl.addEventListener("click", (e) => {
  if (e.target === editContactPopupEl) {
    closeEditContactOverlay();
  }
});
