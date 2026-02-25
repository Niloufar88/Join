const contactContainer = document.querySelector(
  ".contacts .contact-list .contact-list-items .contact-container",
);
const contactName = document.querySelector(
  ".contacts .contact-list .contact-list-items .contact-container .contactName",
);
const addContactPopup = document.querySelector(".add-contact-popup");
const contactListEl = document.querySelector(".contacts .contact-list");
const contactBadge = document.querySelector(
  ".contacts .contact-list .contact-list-items .contact-badge",
);
const contactAlphabet = document.querySelector(
  ".contacts .contact-list .contact-list-items .contact-alphabet",
);
const cancelBtn = document.getElementById("cancelBtn");
const nameInput = document.getElementById("name_input");
const emailInput = document.getElementById("email_input");
const phoneInput = document.getElementById("phone_input");
const createMessage = document.querySelector(".popup-message");
const editContactPopup = document.querySelector(".edit-contact-popup");
const contactDashboard = document.querySelector(".contact-dashboard");
const contactSection = document.querySelector(".contacts");
const contactBox = document.querySelector(".contact-box");

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
