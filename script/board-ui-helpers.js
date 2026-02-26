/**
 * Normalizes priority values and returns a CSS state string.
 * @param {string|string[]} priority
 * @returns {"urgent"|"medium"|"low"|""}
 */
function filterPriority(priority) {
  const prioArray = Array.isArray(priority) ? priority : [priority];
  for (let i = 0; i < prioArray.length; i++) {
    if (prioArray[i] === "urgent") return "urgent";
    if (prioArray[i] === "medium") return "medium";
    if (prioArray[i] === "low") return "low";
  }
  return "";
}

/**
 * Maps category labels to CSS class names.
 * @param {string|string[]} category
 * @returns {"technical-task"|"user-story"|""}
 */
function filterCategory(category) {
  const categoryArray = Array.isArray(category) ? category : [category];
  for (let i = 0; i < categoryArray.length; i++) {
    if (categoryArray[i] === "Technical Task") return "technical-task";
    if (categoryArray[i] === "User Story") return "user-story";
  }
  return "";
}

/**
 * Updates visibility of empty messages per column depending on whether cards exist.
 * @returns {void}
 */
function updateAllEmptyMessages() {
  const columns = document.querySelectorAll(".in-progress[data-status]");
  columns.forEach((column) => {
    const cardContainer = column.querySelector(".cardsContainer");
    const emptyMessage = column.querySelector(".empty");
    if (!cardContainer || !emptyMessage) return;
    if (cardContainer.children.length === 0) {
      emptyMessage.classList.remove("emptyDisplay");
    } else {
      emptyMessage.classList.add("emptyDisplay");
    }
  });
}

/**
 * Converts a date string from "YYYY-MM-DD" to "DD/MM/YYYY".
 * @param {string} taskduedate
 * @returns {string}
 */
function dateStringChange(taskduedate) {
  const [y, m, d] = taskduedate.split("-");
  return `${d}/${m}/${y}`;
}

/**
 * Capitalizes the first letter of the given string.
 * @param {string} value
 * @returns {string}
 */
function capitalizeLetters(value) {
  return value ? value[0].toUpperCase() + value.slice(1) : "";
}

/**
 * Renders avatars for checked contacts.
 * @param {Contact[]} contacts
 * @returns {string}
 */
function capitalizeLettersFullName(contacts) {
  return renderTaskContact(contacts);
}

/**
 * Calculates the statistics for subtasks.
 * @param {Object} task
 * @returns {Object|null} Stats object or null if no subtasks are available.
 */
function getSubtaskStats(task) {
  const subtasks = task.subtasks || [];
  const total = subtasks.length;
  const checked = subtasks.filter((sub) => sub.state === "check").length;
  if (total === 0 || checked === 0) {
    return null; 
  }
  return { total, checked };
}

