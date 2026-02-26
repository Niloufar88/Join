/**
 * Reference to the main menu button DOM element.
 * Used to toggle the navigation menu visibility.
 *
 * @global
 * @constant
 * @type {HTMLElement}
 */
let menuButton = document.getElementById("menu-button");

/**
 * Reference to the user icon DOM element.
 * Represents the user profile/avatar in the navigation bar.
 *
 * @global
 * @constant
 * @type {HTMLElement}
 */
let userIcon = document.getElementById("user-icon");

/**
 * Reference to the help toggle/switch DOM element.
 * Used to show/hide help or support information.
 *
 * @global
 * @constant
 * @type {HTMLElement}
 */
let switchHelp = document.getElementById("switch_help");

/**
 * Reference to the dropdown menu DOM element.
 * Contains user actions and settings options.
 *
 * @global
 * @constant
 * @type {HTMLElement}
 */
const dropDownMenu = document.getElementById("dropDown-menu");

/**
 * Stored user name retrieved from sessionStorage.
 * Used for personalized greeting messages.
 *
 * @global
 * @type {string|null}
 */
const userName = sessionStorage.getItem("name");

/**
 * Reference to the DOM element displaying the user's welcome message.
 * Shows personalized greeting upon login.
 *
 * @global
 * @constant
 * @type {HTMLElement}
 */
const userNameWelcomeMsg = document.getElementById("userName");

/**
 * Reference to the DOM element showing the signed-in user status.
 * Displays current authentication state or user info.
 *
 * @global
 * @constant
 * @type {HTMLElement}
 */
const signedUser = document.getElementById("signedUser");

/**
 * Variable to store user initials.
 * Used for avatar placeholder when image is not available.
 *
 * @global
 * @type {string}
 * @default ""
 */
let initials = "";

/**
 * Hides the dropdown menu if it exists and is currently visible.
 * @description
 * Checks for the existence of `dropDownMenu` and the absence of the `.hide` class.
 * Adds the `.hide` class to hide the menu via CSS.
 * @requires dropDownMenu - The DOM element of the dropdown.
 */
if (dropDownMenu && !dropDownMenu.classList.contains("hide")) {
  dropDownMenu.classList.add("hide");
}

/**
 * a function to get the initials from the user name to show in header
 */
if (!userName || typeof userName !== "string") {
  initials = "??";
} else {
  const nameParts = userName.trim().split(" ");
  const firstInitial = nameParts[0]
    ? nameParts[0].charAt(0).toUpperCase() || ""
    : "";
  const lastInitial = nameParts[nameParts.length - 1]
    ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() || ""
    : "";
  initials = firstInitial + lastInitial;
  getNameInitialsMenuButton();
  showUserNameWelcomeMsg();
  showSignedUserName();
}

/**
 * use initials to show in menu button and if the user is guest then show G in menu button
 */
function getNameInitialsMenuButton() {
  if (sessionStorage.getItem("name") === "Guest") {
    initials = "G";
    menuButton.textContent = initials;
    return;
  }
  menuButton.textContent = initials;
}

/**
 * based on initials show the welcome message and signed user name in summmary page  and if the user is guest then show empty string in welcome message and signed user name
 */

function showUserNameWelcomeMsg() {
  if (userNameWelcomeMsg) {
    if (sessionStorage.getItem("name") === "Guest") {
      userNameWelcomeMsg.textContent = "";
    } else {
      userNameWelcomeMsg.textContent = userName;
    }
  }
}

/**
 * based on initials show the signed user name in dropdown menu and if the user is guest then show empty string in dropdown menu
 */
function showSignedUserName() {
  if (signedUser) {
    if (sessionStorage.getItem("name") === "Guest") {
      signedUser.textContent = "";
    } else {
      signedUser.textContent = userName;
    }
  }
}

/**
 * die function to show or hide the dropdown menu by clicking on menu button
 */
function toggleMenu() {
  if (!dropDownMenu) {
    return;
  }
  if (!menuOverlay) {
    return;
  }
  updateMenuPosition();
  menuOverlay.classList.toggle("hidden");
  dropDownMenu.classList.toggle("hide");
}

/**
 * add event listener on menuOverlay to close the dropdown menu when user click outside of the dropdown menu
 */
const menuOverlay = document.querySelector(".menuOverlay");
if (menuOverlay) {
  menuOverlay.addEventListener("click", (event) => {
    if (event.target === menuOverlay) {
      closeDropdownMenu();
    }
  });
}

/**
 * a function to close the dropdown menu and hide the menu overlay when user click outside of the dropdown menu
 */
function closeDropdownMenu() {
  if (dropDownMenu) dropDownMenu.classList.add("hide");
  if (menuOverlay) menuOverlay.classList.add("hidden");
}

/**
 * check the screen size and update the position of dropdown menu accordingly
 * and adds or removes the "hide" class from the switchHelp element based on the screen size
 */

function updateMenuPosition() {
  if (!dropDownMenu) return;
  const checkQueries = window.matchMedia("(max-width: 992px)");
  if (checkQueries.matches) {
    if (switchHelp) switchHelp.classList.remove("hide");
    dropDownMenu.style.top = "280px";
  } else {
    if (switchHelp) switchHelp.classList.add("hide");
    dropDownMenu.style.top = "230px";
  }
  dropDownMenu.style.position = "absolute";
  dropDownMenu.style.right = "0";
}

/**
 * define a function to remove userId,userStatus and name and go back to login page when user click log out button
 */
function logOut() {
  sessionStorage.removeItem("userID");
  sessionStorage.removeItem("userStatus");
  sessionStorage.removeItem("name");
}
