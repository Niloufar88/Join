let container = document.querySelector(".floating-contact");

/**
 * Load contacts from Firebase realtime Database,
 * then render the updated contact list
 */
async function initContacts() {
  await loadDataBase();
  createContactList();
  checkQueriesForContacts();
}

/**
 * checked if fetchedData from firebase is available
 * defines a variable: source to push contacts data and id into it
 * create a new array from the fetched Data object by pushing each contact with its ID into source
 * filter out contacts without name or email using if condition
 * sort contacts alphabetically by name using sort method
 * @returns {Array} sorted array of contacts
 */
function getContactArray() {
  if (!fetchedData || !Object.keys(fetchedData).length) {
    return [];
  }
  const source = [];
  Object.entries(fetchedData).forEach(([id, data]) => {
    if (data.name && data.email) {
      source.push({ id, ...data });
    }
  });
  const sortedContacts = [...source].sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });
  return sortedContacts;
}

/**
 * build contact item HTML using template
 * @param {string} contact
 * @param {string} color
 * @param {boolean} showAlphabet
 * get first and last initials for contact badge using a function: getInitials
 * get first letter of contact name for alphabet header using charAt method
 * checks if alphabet header should be shown
 * @returns a function call: renderContactListTemplate with 5 parameters
 */
function buildContactItemHTML(contact, color, showAlphabet) {
  const contactColor = contact.color;
  const initials = contact.initials;
  const firstLetter = contact.name ? contact.name.charAt(0).toUpperCase() : "#";
  const alphabetHeader = showAlphabet
    ? `<h3 class="contact-alphabet">${firstLetter}</h3><div id="contact-divider"></div>`
    : "";
  return renderContactListTemplate(
    contact.name,
    contact.email,
    contactColor,
    initials,
    alphabetHeader,
  );
}

/**
 * get sorted Contacts using function: getContactArray
 * checks if there are contacts to display using length property
 * if no contacts, sets innerHTML to show no contacts message and returns
 * defines last variable to track last alphabet header shown
 * defines html variable to accumulate generated HTML
 * make a forEch loop through contact array to extract contact name and index to use later to get colors for contact badges by using Modulo operator
 * determines when to show alphabet headers
 * iterates through contact array to build HTML by using buildContactItemHTML function with 3 parameters: @param {String} contact, @param {String} color, @param {Boolean} show
 * assign html to contactListEl innerHTML to render contact list
 */
async function createContactList() {
  const array = getContactArray();
  if (!array.length) {
    contactListEl.innerHTML =
      '<div class="no-contacts" style="padding: 20px; text-align: center; color: #888;">No contacts available</div>';
    return;
  }
  let html = "";
  let last = "";
  let needsUpdate = false;
  array.forEach((contact) => {
    if (!contact.initials) {
      contact.initials = getInitials(contact.name);
      needsUpdate = true;
    }
    const first = contact.name ? contact.name.charAt(0).toUpperCase() : "#";
    const show = first !== last;
    if (show) last = first;
    html += buildContactItemHTML(contact, contact.color, show);
  });
  contactListEl.innerHTML = html;
  if (needsUpdate) {
    await pushContactsToAPI();
  }
}

async function pushContactsToAPI() {
  await fetch(storageUrl + ".json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fetchedData),
  });
}

//
/**
 * @param {string} fullName  using input value from contact name
 * checks for valid fullName string
 * defines nameParts variable to split the full name into two parts
 * gets first character of first and last parts, converts to uppercase
 * @returns a {String} by concatenates the two variables: firstInitial + lastInitial
 */
function getInitials(fullName) {
  if (!fullName || typeof fullName !== "string") {
    return "?";
  }
  const nameParts = fullName.trim().split(" ");
  const firstInitial = nameParts[0]
    ? nameParts[0].charAt(0).toUpperCase() || ""
    : "";
  const lastInitial = nameParts[nameParts.length - 1]
    ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() || ""
    : "";
  return firstInitial + lastInitial;
}

// Find or create floating contact container
function floatingContainer() {
  if (!container) {
    const parent =
      document.querySelector(".contact-dashboard") ||
      document.querySelector("main");
    container = document.createElement("div");
    container.className = "floating-contact";
    if (parent) parent.appendChild(container);
  }
}

/**
 * @param {Event} event
 * get contact data from clicked DOM element using event delegation method to target contact container, name Element and email Element
 * validates that contact-container exists
 * @returns an object with contactName, contactEmail, and contactColor
 */
function getContactDataFromDOM(event) {
  const clicked = event.target.closest(".contact-container");
  if (!clicked) return null;
  const badge = clicked.querySelector(".contact-badge");
  const contactColor = badge ? badge.style.backgroundColor : null;
  const nameElement = clicked.querySelector(".contactName");
  const emailElement = clicked.querySelector(".contactEmail");
  const contactName = nameElement ? nameElement.textContent.trim() : "";
  const contactEmail = emailElement ? emailElement.textContent.trim() : "";
  if (!contactName || !contactEmail) {
    console.error("Contact data missing");
    return null;
  }
  return { contactName, contactEmail, contactColor };
}

/**
 * @param {string} contactName
 * @param {string} contactEmail
 * checks if fetchedData is valid
 * make a for loop through fetchedData entries and makes comparisons
 * checks fetchedData for contact matching name and email
 * @returns array of contact data or null if not found
 */
function findContactInFirebase(contactName, contactEmail) {
  if (!fetchedData || typeof fetchedData !== "object") return null;
  for (const [id, data] of Object.entries(fetchedData)) {
    if (data.name === contactName && data.email === contactEmail) {
      return data;
    }
  }
  return null;
}

/**
 * @param {string} foundContact
 * @param {string} contactColor
 * get initials from full name
 * set background color with fallback
 * render floating contact card container innerHTML using renderFloatingContactTemplate function with 5 parameters
 */
function renderFloatingCard(foundContact) {
  container.innerHTML = renderFloatingContactTemplate(
    foundContact.name,
    foundContact.email,
    foundContact.phone,
    foundContact.color,
    foundContact.initials,
  );
  container.classList.remove("d-none");
  checkQueriesForEditTools();
}

/**
 * @param {Event} event
 * Ensures that the floating card is displayed when a contact is clicked, by calling up all four functions sequentially:
 * checks if floating container exists, gets contact data from clicked DOM element
 * finds contact in fetchedData by name and email
 * renders floating contact card using renderFloatingCard funtion with 2 parameters or error message
 */

function getFromDomAndFindInFirebase(event) {
  const contactData = getContactDataFromDOM(event);
  if (!contactData) return;
  const foundContact = findContactInFirebase(
    contactData.contactName,
    contactData.contactEmail,
  );
  return { foundContact, contactData };
}

/**
 * a function which handles the display of a floating contact card when a contact is clicked, by calling up all four functions sequentially:
 * checks if floating container exists
 * gets contact data from clicked DOM element
 * finds contact in fetchedData by name and email
 * renders floating contact card using renderFloatingCard funtion with 2 parameters or error message
 * @param {Event} event
 */
function showFloatingCard(event) {
  floatingContainer();
  const { foundContact, contactData } = getFromDomAndFindInFirebase(event);
  if (foundContact) {
    renderFloatingCard(foundContact, contactData.contactColor);
  } else {
    console.error(
      "Contact not found:",
      contactData.contactName,
      contactData.contactEmail,
    );
    container.innerHTML = "<h2>Contact not found</h2>";
    container.classList.remove("d-none");
  }
}

/**
 * sets up event listener on contact list element to behave responsively
 * removes any existing click event listener to avoid duplicates
 * adds new click event listener to handle contact clicks using handleContactClick function
 */
function checkQueriesForContacts() {
  contactListEl.removeEventListener("click", handleContactClick);
  contactListEl.addEventListener("click", handleContactClick);
}

/**
 * check for screen size using matchMedia
 * if screen width is less than or equal to 767px, hide contact section and show contact dashboard
 * creates blue arrow element for navigation back to contact section
 * adds click event listener to blue arrow to toggle visibility of sections and remove arrow
 * calls showFloatingCard function to display floating contact card
 * @param {Event} event
 */
function handleContactClick(event) {
  const contactContainer = event.target.closest(".contact-container");
  if (!contactContainer) return;
  event.stopPropagation();
  const checkQueries = window.matchMedia("(max-width: 991px)");
  if (!checkQueries.matches) {
    if (contactContainer.classList.contains("active")) {
      contactContainer.classList.remove("active");
      return;
    }
    containerEventHandler();
    contactContainer.classList.add("active");
    contactContainer.style.pointerEvents = "none";
  }
  if (checkQueries.matches) {
    showFloatingCardOnSmallScreens();
  }
  showFloatingCard(event);
}

function containerEventHandler() {
  document.querySelectorAll(".contact-container").forEach((container) => {
    container.classList.remove("active");
    container.style.pointerEvents = "auto";
  });
}

/**
 * a function which switches the view to a floating contact card on small screens when a contact is clicked
 * hides the main contact section and shows the contact dashboard
 * creates a blue arrow element for navigation back to the contact section
 * adds click event listener to the blue arrow to toggle visibility of sections and remove the arrow
 */
function showFloatingCardOnSmallScreens() {
  contactSection.style.display = "none";
  contactDashboard.style.display = "block";
  const blueArrow = document.createElement("a");
  blueArrow.className = "blue-arrow";
  contactDashboard.insertBefore(blueArrow, contactDashboard.lastChild);
  blueArrow.addEventListener("click", () => {
    contactSection.style.display = "block";
    contactDashboard.style.display = "none";
    blueArrow.remove();
  });
}

/**
 * a function to set up event listeners for edit tools in floating contact card on small screens
 * checks if edit tool elements container exists
 * removes any existing click event listener to avoid duplicates
 * adds new click event listener to handle edit tool clicks using handleEditToolClick function
 */
function checkQueriesForEditTools() {
  const editToolEls = document.getElementById("contact-edit-tools");
  if (!editToolEls) return;
  editToolEls.removeEventListener("click", handleEditToolClick);
  editToolEls.addEventListener("click", handleEditToolClick);
}

/**
 * a function to handle clicks on edit tools in floating contact card on small screens
 * checks if event target is within edit tool elements container
 * prevents event bubbling to avoid triggering other click handlers
 * calls function to open edit menu dialog on small screens
 * @param {Event} event
 */
function handleEditToolClick(event) {
  event.stopPropagation();
  const editToolEls = document.getElementById("contact-edit-tools");
  if (!editToolEls) return;
  const checkquery = window.matchMedia("(max-width: 991px)");
  if (checkquery.matches) {
    openEditMenuDialog();
  }
}

/**
 * get Data from input fields in floating contact container
 * validates that name and email are present
 * @returns {object|null} contactName and contactEmail or null if missing
 */
function getDataFromClickedContactFloating() {
  const nameElement = document.getElementById("contact-name");
  const emailElement = document.getElementById("span-email");
  if (!nameElement || !emailElement) {
    console.error("Contact name or email is missing");
    return null;
  }
  const contactName = nameElement.textContent.trim();
  const contactEmail = emailElement.textContent.trim();
  return { contactName, contactEmail };
}

/**
 * get updates Data from fetchedData by comparing name and email
 * @returns {object|null} contactName, contactEmail, foundContact, foundId or null if not found
 */
function saveDataAsFoundContact() {
  const contactData = getDataFromClickedContactFloating();
  if (!contactData) return null;
  const { contactName, contactEmail } = contactData;
  for (const [id, data] of Object.entries(fetchedData)) {
    if (data.name === contactName && data.email === contactEmail) {
      return { foundContact: data, foundId: id, contactName, contactEmail };
    }
  }
  return null;
}

/**
 * * @param {Event} event
 * delete contacts when floating container is open
 * uses saveDataAsFoundContact to get contact data
 * calls deleteContact with found contact id
 * reloads data from Firebase and updates contact list display
 * hides floating container and shows success message or error alert
 */
async function deleteFloatingData(event) {
  if (typeof closeEditMenuDialog === "function") {
    closeEditMenuDialog();
  }
  const contactData = saveDataAsFoundContact();
  if (!contactData) return;
  const { foundContact, foundId, contactName, contactEmail } = contactData;
  if (foundContact) {
    try {
      await deleteContact(foundId);
      await deleteFloatingDataFunctionSeries();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  } else {
    console.error(
      "Contact not found for deletion - Name:",
      contactName,
      "Email:",
      contactEmail,
    );
  }
}

/**
 * an async function which performs a series of operations to delete a contact and update the UI accordingly
 * calls loadDataBase to refresh data from Firebase realtime Database
 * calls createContactList to re-render the contact list with updated data
 * and executed a popup message only if the max width is greater than 450px
 */
async function deleteFloatingDataFunctionSeries() {
  await loadDataBase();
  await createContactList();
  container.classList.add("d-none");
  if (window.innerWidth > 450) {
    popupMessage("Contact successfully deleted!");
  } else {
    contactSection.style.display = "block";
    contactDashboard.style.display = "none";
  }
}
