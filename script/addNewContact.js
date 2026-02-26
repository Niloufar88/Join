const dialogElement = document.getElementById("edit-menu-dialog");

/**
 * get data from input fields in add-contact-popup dynamically
 * validates input fields values
 * makes new contact object with given Data from the user
 * @returns an Object: new contact
 */

function getDataToMakeNewContactVariables() {
  const nameInputField = document.getElementById("name_input");
  const emailInputField = document.getElementById("email_input");
  const phoneInputField = document.getElementById("phone_input");
  const contactColor = colors[Math.floor(Math.random() * colors.length)];
  return { nameInputField, emailInputField, phoneInputField, contactColor };
}

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
 * add new contacts to the list from add-contact-popup
 * validates input fields values
 * saves new contact to Firebase realtime Database
 * reloads data from Firebase to get updated list
 * updates contact list display
 * closes popup and clears input fields
 * shows success message or error alert
 */

function addNewContactVariables() {
  const contactName = document.getElementById("name_input").value.trim();
  const contactEmail = document.getElementById("email_input").value.trim();
  const contactPhone = document.getElementById("phone_input").value.trim();
  return { contactName, contactEmail, contactPhone };
}

function addNewContactErrorHandling() {
  const errorMsg = document.querySelectorAll(".contactValidationErrorMsg");
  if (errorMsg) {
    errorMsg.forEach((msgBox) => {
      msgBox.style.visibility = "hidden";
    });
  }
}

async function addNewContactIsValid() {
  const isValid = await validateContactForm();
  if (!isValid) {
    const errorMsg = document.querySelectorAll(".contactValidationErrorMsg");
    if (errorMsg) {
      errorMsg.forEach((msgBox) => {
        msgBox.style.visibility = "visible";
        msgBox.textContent = "Please check your data and try again.";
      });
    }
    return;
  }
}

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

function makeErrorMsgVisibleByAddNewContact() {
  const errorMsg = document.querySelectorAll(".contactValidationErrorMsg");
  if (errorMsg) {
    errorMsg.forEach((msgBox) => {
      msgBox.style.visibility = "visible";
      msgBox.textContent = "Please fill in all fields.";
    });
  }
}

async function addNewContact() {
  const newContact = await getDataToMakeNewContact();
  const { contactName, contactEmail, contactPhone } = addNewContactVariables();
  addNewContactErrorHandling();
  if (!contactName || !contactEmail || !contactPhone) {
    makeErrorMsgVisibleByAddNewContact();
    return;
  }
  await addNewContactIsValid();
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
