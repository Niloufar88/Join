/**
 * create HTML template for contact list item
 * @param {string} name name of contact
 * @param {string} email email of contact
 * @param {string} color color for contact badge
 * @param {string} initials initials(first letters of full name) of contact
 * @param {string} alphabetHeader alphabet header for grouping contacts
 * @returns {string} HTML template for contact list item
 */
function renderContactListTemplate(
  name,
  email,
  color,
  initials,
  alphabetHeader,
) {
  return `
    <div class="contact-list-items">
                    ${alphabetHeader}
                    <div class="contact-container"  onclick="showFloatingCard(event)">
                        <div class="contact-badge" style="background-color: ${color}">${initials}</div>
                        <div class="contactDetails">
                            <h3 class="contactName">${name}</h3>
                            <span class="contactEmail">${email}</span>
                        </div>
                    </div>
    </div>`;
}

/**
 * create HTML template for floating contact card
 * @param {string} name name of the clicked contact
 * @param {string} email email of the clicked contact
 * @param {string} phone phone number of the clicked contact
 * @param {string} backgroundColor background color for contact badge
 * @param {string} initials initials of the clicked contact
 * @returns {string} HTML template for floating contact card
 */
function renderFloatingContactTemplate(
  name,
  email,
  phone,
  backgroundColor,
  initials,
) {
  return `
    <div class="floating-contact">
                <div id="contact-header">
                    <div class="contact-badge" id="contact-symbol" style="background-color: ${backgroundColor}">${initials}</div>
                    <div id="contact-text">
                        <div id="contact-name">${name}</div>
                        <div id="contact-edit-tools">
                            <div id="edit" class="edit-delete-component-default" onclick="renderEditContactOverlay()">
                                <img src="" alt="" />
                                <span>Edit</span>
                            </div>
                            <div id="delete" class="edit-delete-component-default" onclick="deleteFloatingData(event)">
                                <img src="" alt="" />
                                <span>Delete</span>
                            </div>
                        </div>
                    </div>
                </div>
                <h3 id="contact-information">Contact Information</h3>
                <div id="contact-details">
                    <h4 id="contact-email">Email</h4>
                    <a class="span-email" id="span-email">${email}</a>
                    <h4 id="contact-phone">Phone</h4>
                    <span id="span-phone">${phone}</span>
                </div>
            </div>`;
}

function renderAddContactTemplate() {
  return `
  <div class="add-contact-overlay">
                <div class="add-contact-overview">
                  <div class="join-logo-contact">
                    <img src="../assets/img/join-logo-add-contact.svg" alt="" />
                  </div>
                  <div class="add-contact-text">
                    <h2 class="add-contact-title">Add contact</h2>
                    <h4 class="add-contact-subtitle">
                      Tasks are better with a team!
                    </h4>
                    <div class="blue-vector">
                      
                    </div>
                  </div>
                </div>
                <div class="add-contact-container">
                  <div class="close-btn" onclick="closePopupOverlay()">
                  <i class="fa-solid fa-xmark"></i>
                  </div>
                  <div class="add-contact-form">
                    <div class="add-contact-badge">
                      <img src="../assets/img/add-contact-badge.svg" alt="" />
                    </div>

                    <div class="contactForm">
                      <div class="inputContainer">
                        <input
                          type="text"
                          placeholder="Full Name"
                          id="name_input"
                          required
                          onblur="contactNameValidation()"
                        />
                        <img
                          src="../assets/img/add-contact-person-icon.svg"
                          alt=""
                        />
                      </div>

                      <div class="contactValidationErrorMsg" id="contactnameErrorMsg">Name cannot be empty</div>

                      <div class="inputContainer">
                        <input
                          type="email"
                          placeholder="aa@bb.de"
                          id="email_input"
                          required
                          onblur="contactEmailValidation()"
                        />
                        <img
                          src="../assets/img/add-contact-mail-icon.svg"
                          alt=""
                        />
                      </div>

                       <div class="contactValidationErrorMsg" id="contactemailErrorMsg">Email cannot be empty</div>

                      <div class="inputContainer">
                        <input
                          type="tel"
                          placeholder="+49 123 4567890"
                          id="phone_input"
                          required
                          onblur="contactPhoneValidation()"
                        />
                        <img
                          src="../assets/img/add-contact-call-icon.svg"
                          alt=""
                        />
                      </div>

                       <div class="contactValidationErrorMsg" id="contactphoneErrorMsg">Phone cannot be empty</div>

                      <div class="add-contact-buttons">
                        <button
                          class="secondary-btn-default-icon"
                          id="cancelBtn"
                          onclick="closePopupOverlay()"
                        >
                          Cancel <img src="" alt="" />
                        </button>
                        <button
                          class="primary-btn-default-icon"
                          id="createContactBtn"
                          onclick="addNewContact()"
                        >
                          Create contact<img
                            src="../assets/img/create-contact-check.svg"
                            alt=""
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  `;
}

/**
 * create HTML template for edit contact overlay
 * @param {string} name name of contact
 * @param {string} email email of contact
 * @param {string} phone phone number of contact
 * @param {string} contactColor background color for contact badge
 * @param {string} initials initials of contact
 * @returns {string} HTML template for edit contact overlay
 */
function renderEditContactTemplate(name, email, phone, contactColor, initials) {
  return `
              <div class="edit-contact-overlay">
                <div class="edit-contact-overview">
                  <div class="join-logo-contact">
                    <img src="../assets/img/join-logo-add-contact.svg" alt="" />
                  </div>
                  <div class="edit-contact-text">
                    <h2 class="edit-contact-title">Edit contact</h2>

                    <div class="blue-vector">
                      
                    </div>
                  </div>
                </div>
                <div class="edit-contact-container">
                  <div class="close-btn" onclick="closeEditContactOverlay()">
                    <i class="fa-solid fa-xmark"></i>
                  </div>
                  <div class="edit-contact-form">
                    <div class="contact-badge" style="background-color: ${contactColor}">
                      ${initials}
                    </div>

                    <div class="contactForm">
                      <div class="inputContainer">
                        <input type="text" placeholder="Name" id="nameInput" value="${name}" onblur="editContactNameValidation()" />
                        <img
                          src="../assets/img/add-contact-person-icon.svg"
                          alt=""
                        />
                      </div>

                      <div class="editValidationErrorMsg" id="editnameErrorMsg">Name cannot be empty</div>

                      <div class="inputContainer">
                        <input
                          type="email"
                          placeholder="Email"
                          id="emailInput"
                          value="${email}"
                          onblur="editContactEmailValidation()"
                        />
                        <img
                          src="../assets/img/add-contact-mail-icon.svg"
                          alt=""
                        />
                      </div>

                      <div class="editValidationErrorMsg" id="editemailErrorMsg">Email cannot be empty</div>

                      <div class="inputContainer">
                        <input
                          type="tel"
                          placeholder="Phone"
                          id="phoneInput"
                          value="${phone}"
                          onblur="editContactPhoneValidation()"
                        />
                        <img
                          src="../assets/img/add-contact-call-icon.svg"
                          alt=""
                        />
                      </div>

                      <div class="editValidationErrorMsg" id="editphoneErrorMsg">Phone cannot be empty</div>

                      <div class="edit-contact-buttons">
                        <button
                          class="secondary-btn-default-icon"
                          id="delete-btn"
                          onclick="deleteContactFromEditOverlay(event)"
                        >
                          Delete <img src="" alt="" />
                        </button>
                        <button
                          class="primary-btn-default-icon"
                          id="saveContact-btn"
                          onclick="saveEditedContact()"
                        >
                          Save<img
                            src="../assets/img/create-contact-check.svg"
                            alt=""
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            
    `;
}

function renderEditToolsDialog() {
  return `
  <div class="editMenuDialogContainer">
   <div id="editDialog" class="edit-delete-component-default" onclick="(renderEditContactOverlay(), EditMenuDialog(),preventEventBubbling(event))">
        <img src="" alt="" />
        <span>Edit</span>
   </div>
   <div id="deleteDialog" class="edit-delete-component-default" onclick="(deleteFloatingData(event), preventEventBubbling(event))">
        <img src="" alt="" />
        <span>Delete</span>
   </div>
  </div>`;
}
