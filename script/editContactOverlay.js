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
    await deleteContactFromEditOverlayFunctionSeries();
    if (window.innerWidth > 450) {
      popupMessage("Contact successfully deleted!");
    } else {
      deleteContactFromEditOverlayMobile();
    }
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}

/**
 * a function which executes series of functions to delete contact from edit overlay:
 */
async function deleteContactFromEditOverlayFunctionSeries() {
  await loadDataBase();
  await createContactList();
  closeEditContactOverlay();
  container.classList.add("d-none");
}

/**
 * a function which handles the display of the contact section and dashboard after deleting a contact from the edit overlay on mobile view
 */
function deleteContactFromEditOverlayMobile() {
  contactSection.style.display = "block";
  contactDashboard.style.display = "none";
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
 * defines function to render edit contact overlay with animation
 */

function renderEditContactOverlayMoves() {
  const overlay = editContactPopup.querySelector(".edit-contact-overlay");
  editContactPopup.classList.remove("d-none");
  overlay.offsetHeight;
  overlay.classList.remove("slide-out");
  overlay.classList.add("slide-in");
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
 * a function which opens a dialog with edit and delete options for contacts on small screens
 * checks if dialog element exists
 * gets edit tool elements container
 * @returns {void}
 */
function openEditMenuDialog() {
  const editMenuDialog = document.getElementById("edit-menu-dialog");
  if (!editMenuDialog) return;
  const editToolEls = document.getElementById("contact-edit-tools");
  if (!editToolEls) return;
  editMenuDialog.classList.remove("slide-out");
  editMenuDialog.innerHTML = renderEditToolsDialog();
  editMenuDialog.classList.add("editToolClicked");
  editMenuDialog.offsetHeight;
  editMenuDialog.showModal();
  editMenuDialog.classList.add("slide-in");
}

/**
 * a function which closes the edit menu dialog on small screens with animation
 * checks if dialog element exists
 * removes animation classes and adds slide-out class to trigger animation
 * closes dialog and clears innerHTML after animation duration
 * @returns
 */
function closeEditMenuDialog() {
  const editMenuDialog = document.getElementById("edit-menu-dialog");
  if (!editMenuDialog) return;
  editMenuDialog.classList.remove("editToolClicked");
  editMenuDialog.classList.remove("slide-in");
  editMenuDialog.offsetHeight;
  editMenuDialog.classList.add("slide-out");
  editMenuDialog.close();
  setTimeout(() => {
    if (editMenuDialog) {
      editMenuDialog.classList.remove("slide-out");
      editMenuDialog.innerHTML = "";
    }
  }, 500);
}
