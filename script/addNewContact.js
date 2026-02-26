/**
 * Reference to the edit menu dialog DOM element.
 * Used to control visibility and interaction with the edit modal.
 * @global
 * @constant
 * @type {HTMLElement}
 * @readonly
 */
const dialogElement = document.getElementById("edit-menu-dialog");

/**
 * a function which saves the essential variables for creating a new contact in the contact form and returns them as an object to be used in the function which creates a new contact.
 * @returns {Object} An object containing references to the input fields and a randomly assigned contact color.
 */

function getDataToMakeNewContactVariables() {
  const nameInputField = document.getElementById("name_input");
  const emailInputField = document.getElementById("email_input");
  const phoneInputField = document.getElementById("phone_input");
  const contactColor = colors[Math.floor(Math.random() * colors.length)];
  return { nameInputField, emailInputField, phoneInputField, contactColor };
}

/**
 * an async function which collects input field data, make initials from the name, and constructs a new contact object to be saved in the database.
 * @typedef {Object} newContact
 * @property {string} name - The full name of the contact.
 * @property {string} email - The email address of the contact.
 * @property {string} phone - The phone number of the contact.
 * @property {string} initials - Generated initials from the name.
 * @property {string} color - Assigned color for the contact avatar.
 * @property {boolean} checked - Initial selection status.
 * @async
 * @returns {Promise<newContact|undefined>} The new contact object if valid, otherwise undefined.
 * @requires {function} getDataToMakeNewContactVariables - Helper to retrieve DOM input elements.
 * @requires {function} getInitials - Helper to generate initials from name.
 */
async function getDataToMakeNewContact() {
  const { nameInputField, emailInputField, phoneInputField, contactColor } =
    getDataToMakeNewContactVariables();
  const initials = getInitials(nameInputField.value.trim());

  if (!nameInputField || !emailInputField || !phoneInputField) {
    console.error("Input fields not found in DOM");
    return;
  }
  const newContact = {
    name: nameInputField.value.trim(),
    email: emailInputField.value.trim(),
    phone: phoneInputField.value.trim(),
    initials: initials,
    color: contactColor,
    checked: false,
  };
  return newContact;
}

/**
 *a function which saves the essential variables from input fields in the contact form and returns them as an object to be used in the function which creates a new contact.
 * @returns {{contactName: string, contactEmail: string, contactPhone: string}} An object containing the contact name, email, and phone number.
 */

function addNewContactVariables() {
  const contactName = document.getElementById("name_input").value.trim();
  const contactEmail = document.getElementById("email_input").value.trim();
  const contactPhone = document.getElementById("phone_input").value.trim();
  return { contactName, contactEmail, contactPhone };
}

/**
 * Clears all contact validation error messages from the UI.
 * Hides all elements with the class ".contactValidationErrorMsg" by setting visibility to hidden.
 * @function addNewContactErrorHandling
 * @returns {void}
 * @sideeffects Modifies DOM element styles (visibility)
 * @requires {HTMLElement[]} .contactValidationErrorMsg - Error message elements in the DOM
 */
function addNewContactErrorHandling() {
  const errorMsg = document.querySelectorAll(".contactValidationErrorMsg");
  if (errorMsg) {
    errorMsg.forEach((msgBox) => {
      msgBox.style.visibility = "hidden";
    });
  }
}

/**
 * Validates the contact form and displays error messages if validation fails.
 * Shows error feedback in the DOM and stops execution if data is invalid.
 * @async
 * @function addNewContactIsValid
 * @returns {Promise<void>}
 * @sideeffects Modifies DOM elements (error messages visibility and text)
 * @requires {function} validateContactForm - Returns validation status
 */
async function addNewContactIsValid() {
  const isValid = await validateContactForm();
  if (!isValid) {
    contactNameValidation();
    contactEmailValidation();
    contactPhoneValidation();
    return false;
  }
  return true;
}

/**
 * Executes the post-success sequence after creating a contact.
 * Reloads data, updates the list, closes overlays, and shows a success popup.
 * @async
 * @function addNewContactFunctionSeries
 * @returns {Promise<void>}
 * @sideeffects Updates DOM, loads database, shows popup messages
 */
async function addNewContactFunctionSeries() {
  await loadDataBase();
  await createContactList();
  closePopupOverlay();
  if (window.innerWidth > 450) {
    popupMessage("Contact successfully created!");
  } else {
    popupMessageResponsive("Contact successfully created!");
  }
}

/**
 * Displays validation error messages for empty fields during contact creation.
 * Sets visibility to visible and updates text content for error elements.
 * @function makeErrorMsgVisibleByAddNewContact
 * @returns {void}
 * @sideeffects Modifies DOM elements (visibility and text)
 */
function makeErrorMsgVisibleByAddNewContact() {
  const errorMsg = document.querySelectorAll(".contactValidationErrorMsg");
  if (errorMsg) {
    errorMsg.forEach((msgBox) => {
      msgBox.style.visibility = "visible";
      msgBox.textContent = "Please fill in all fields.";
    });
  }
}

/**
 * Main handler for creating a new contact.
 * Validates input, saves to database, and triggers UI updates on success.
 * Handles errors and displays appropriate messages if validation fails.
 * @async
 * @function addNewContact
 * @returns {Promise<void>}
 * @sideeffects Saves to DB, modifies DOM, shows popups
 * @requires {function} getDataToMakeNewContact
 * @requires {function} saveContact
 */
async function addNewContact() {
  const newContact = await getDataToMakeNewContact();
  const { contactName, contactEmail, contactPhone } = addNewContactVariables();
  addNewContactErrorHandling();
  if (!contactName || !contactEmail || !contactPhone) {
    makeErrorMsgVisibleByAddNewContact();
    return;
  }
  await addNewContactIsValid();
  if (!(await addNewContactIsValid())) {
    return;
  }
  if (newContact.name && newContact.email && newContact.phone) {
    try {
      await saveContact(newContact);
      await addNewContactFunctionSeries();
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  } else {
    console.error("Contact data incomplete:", newContact);
  }
}

/**
 * sets innerHTML with template
 * removes class list display none to show popup
 * opens add contact popup overlay
 * triggers slide-in animation
 * clears input fields, so it will be empty when opened
 */
function openPopupOverlay() {
  addContactPopup.innerHTML = renderAddContactTemplate();
  const overlay = addContactPopup.querySelector(".add-contact-overlay");
  addContactPopup.classList.remove("d-none");
  overlay.offsetHeight;
  overlay.classList.remove("slide-out");
  overlay.classList.add("slide-in");
  clearInputFields();
}

/**
 * selects overlay element with class name add-contact-overlay
 * triggers slide-out animation
 * closes add contact popup overlay by adding d-none class after animation
 * Wait for animation to finish before hiding popup for 500ms
 * clears input fields
 */
function closePopupOverlay() {
  const overlay = addContactPopup.querySelector(".add-contact-overlay");
  overlay.classList.remove("slide-in");
  overlay.classList.add("slide-out");
  setTimeout(() => {
    addContactPopup.classList.add("d-none");
  }, 500);
  clearInputFields();
}

/**
 * clears input fields in add contact popup
 */
function clearInputFields() {
  if (nameInput) nameInput.value = "";
  if (emailInput) emailInput.value = "";
  if (phoneInput) phoneInput.value = "";
}

/**
 * * @param {string} message
 * responsible for showing popup messages
 * changes text content of createMessage element
 * removes d-none class to make it visible
 * triggers slide-in animation from the right of the page and after 2 seconds, triggers slide-out animation
 * forces reflow to ensure transition works
 */
function popupMessage(message) {
  createMessage.textContent = `${message}`;
  createMessage.classList.remove("d-none");
  createMessage.offsetHeight;
  createMessage.classList.add("slide-in");
  setTimeout(() => {
    createMessage.classList.remove("slide-in");
    createMessage.classList.add("slide-out");
    setTimeout(() => {
      createMessage.classList.add("d-none");
      createMessage.classList.remove("slide-out");
    }, 500);
  }, 2000);
}

/**
 * Displays a responsive popup message temporarily.
 * Shows the message, triggers reflow, adds responsive class, and hides it after 1.5 seconds.
 * @function popupMessageResponsive
 * @param {string} message - The text content to display in the popup.
 * @returns {void}
 * @sideeffects Modifies DOM element 'createMessage' (classes, text, visibility)
 * @requires {HTMLElement} createMessage - The DOM element to display the message
 */
function popupMessageResponsive(message) {
  createMessage.textContent = `${message}`;
  createMessage.classList.remove("d-none");
  createMessage.offsetHeight;
  createMessage.classList.add("responsive");
  setTimeout(() => {
    createMessage.classList.add("d-none");
    createMessage.classList.remove("responsive");
  }, 1500);
}

/**
 * responsible for opening edit contact popup overlay on mobile devices
 * checks if screen width is less than or equal to 991px
 * if true, removes slide-in class from dialog
 */
function EditMenuDialog() {
  const checkQueries = window.matchMedia("(max-width: 991px)");
  if (checkQueries.matches) {
    dialogElement.classList.remove("slide-in");
    closeDialog();
    dialogElement.classList.remove("slide-out");
    setTimeout(() => {
      dialogElement.classList.remove("slide-out");
      dialogElement.innerHTML = "";
    }, 500);
    renderEditContactOverlay();
  }
}

/**
 * responsible for closing edit contact popup overlay on mobile devices
 */
function closeDialog() {
  dialogElement.close();
}

/**
 * adds click event listener to dialog element to close the dialog when clicking outside of it
 */
dialogElement.addEventListener("click", (event) => {
  if (event.target == dialogElement) {
    dialogElement.close();
  }
});

/**
 * a function to prevent event bubbling when clicking inside the dialog content
 * @param {Event} event
 */
function preventEventBubbling(event) {
  event.stopPropagation();
}
