/**
 * global Variables for Contact Management
 * These variables are used across multiple functions and modules to manage contact data and UI interactions.
 * @global
 * @constant
 * @type {HTMLElement|Array|string}
 */

/**
 * Reference to the contact container DOM element.
 * Used to display individual contact information in the contact list.
 * @global
 * @constant
 * @type {HTMLElement}
 */

const contactContainer = document.querySelector(
  ".contacts .contact-list .contact-list-items .contact-container",
);

/**
 * Reference to the contact name DOM element within the contact container.
 * Used to display the contact's name in the contact list.
 * @global
 * @constant
 * @type {HTMLElement}
 */
const contactName = document.querySelector(
  ".contacts .contact-list .contact-list-items .contact-container .contactName",
);

/**
 * Reference to the contact Popup DOM element.
 * Used to show the form for adding contact information.
 * @global
 * @constant
 * @type {HTMLElement}
 */
const addContactPopup = document.querySelector(".add-contact-popup");

/**
 * Reference to the contact list DOM element.
 * Used to display the list of contacts in the contact container section.
 * @global
 * @constant
 * @type {HTMLElement}
 */
const contactListEl = document.querySelector(".contacts .contact-list");

/**
 * Reference to the contact badge DOM element.
 * Used to display the initials of the contact's name in a badge format with a random background color.
 * @global
 * @constant
 * @type {HTMLElement}
 */
const contactBadge = document.querySelector(
  ".contacts .contact-list .contact-list-items .contact-badge",
);

/**
 * Reference to the contact alphabet DOM element.
 * Used to display the first letter of the contact's name in the contact list, which can be used for sorting or categorizing contacts alphabetically.
 * @global
 * @constant
 * @type {HTMLElement}
 */
const contactAlphabet = document.querySelector(
  ".contacts .contact-list .contact-list-items .contact-alphabet",
);

/**
 * Reference to the cancel button DOM element in the contact form.
 * Used to close the contact form popup without saving any changes.
 * @global
 * @constant
 * @type {HTMLElement}
 */
const cancelBtn = document.getElementById("cancelBtn");

/**
 * Reference to the input container DOM element in the contact form.
 * used to get the name value of the contact from the input field in the contact form.
 * @global
 * @constant
 * @type {HTMLElement}
 */
const nameInput = document.getElementById("name_input");

/**
 * Reference to the email input DOM element in the contact form.
 * Used to get the email value of the contact from the input field in the contact form.
 * @global
 * @constant
 * @type {HTMLElement}
 */
const emailInput = document.getElementById("email_input");

/**
 * Reference to the phone input DOM element in the contact form.
 * Used to get the phone number value of the contact from the input field in the contact form.
 * @global
 * @constant
 * @type {HTMLElement}
 */
const phoneInput = document.getElementById("phone_input");

/**
 * Reference to the create message DOM element.
 * Used to display messages or notifications related to contact actions, such as successful creation.
 * @global
 * @constant
 * @type {HTMLElement}
 */
const createMessage = document.querySelector(".popup-message");

/**
 * Reference to the edit contact popup DOM element.
 * Used to show the form for editing existing contact information.
 * @global
 * @constant
 * @type {HTMLElement}
 */
const editContactPopup = document.querySelector(".edit-contact-popup");

/**
 * Reference to the contact dashboard DOM element.
 * used to display floating contact information and the option to edit or delete the contact when a contact is clicked in the contact list.
 * @global
 * @constant
 * @type {HTMLElement}
 */
const contactDashboard = document.querySelector(".contact-dashboard");

/**
 * Reference to the contact section DOM element.
 * used to display contact information.
 * @global
 * @constant
 * @type {HTMLElement}
 */
const contactSection = document.querySelector(".contacts");

/**
 * Reference to the contact box DOM element.
 * used to display the contact header titles in contact dashboard.
 * @global
 * @constant
 * @type {HTMLElement}
 */
const contactBox = document.querySelector(".contact-box");

/**
 * an Array of Colors for a further use to assign random colors to contact badges based on their initials
 * Each color is represented in RGBA format for consistency and ease of use in CSS styling.
 * The colors are vibrant and distinct to help visually differentiate contacts in the UI.
 * @global
 * @type {Array<string>}
 */
let colors = [
  "rgba(255, 122, 0, 1)",
  "rgba(255, 94, 179, 1)",
  "rgba(110, 82, 255, 1)",
  "rgba(147, 39, 255, 1)",
  "rgba(0, 190, 232, 1)",
  "rgba(31, 215, 193, 1)",
  "rgba(255, 116, 94, 1)",
  "rgba(255, 163, 94, 1)",
  "rgba(252, 113, 255, 1)",
  "rgba(255, 199, 1, 1)",
  "rgba(0, 56, 255, 1)",
  "rgba(195, 255, 43, 1)",
  "rgba(255, 230, 43, 1)",
  "rgba(255, 70, 70, 1)",
  "rgba(255, 187, 43, 1)",
];
