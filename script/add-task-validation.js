/**
 * Validation state object tracking the status of individual form fields.
 * Keys represent field names, values indicate if the field passes validation checks.
 * 
 * @global
 * @type {Object}
 * @property {boolean} title - True if the task title is valid.
 * @property {boolean} duedate - True if the due date is valid.
 * @property {boolean} category - True if the category is selected/valid.
 */
let valid = { title: false, duedate: false, category: false };

/**
 * Temporary storage object for collecting task input data before submission.
 * Structure will match the required payload for the API/Database.
 * 
 * @global
 * @type {Object}
 */
let taskData = {};

/**
 * Adds focus styling and clears error state for an input element.
 * @param {FocusEvent} event
 * @returns {void}
 */
function onFocus(event) {
  const el = /** @type {HTMLElement} */ (event.target);
  el.classList.add("input-focus");
  el.classList.remove("input-error");
}

/**
 * Removes focus styling and updates validation state for the field.
 * @param {FocusEvent} event
 * @returns {void}
 */
function validateOnBlur(event) {
  const el = /** @type {HTMLInputElement} */ (event.target);
  const childEl = el.nextElementSibling;
  const value = el.value.trim();
  const id = el.id;
  el.classList.remove("input-focus");
  if (!value) {
    el.classList.add("input-error");
    if (childEl) childEl.style.visibility = "visible";
    valid[id] = false;
  } else {
    el.classList.remove("input-error");
    if (childEl) childEl.style.visibility = "hidden";
    valid[id] = true;
  }
}

/**
 * Toggles the category dropdown and updates the arrow icon.
 * @param {Event} [event]
 * @returns {void}
 */
function toggleCategory(event) {
  if (event) event.stopPropagation();
  const changeArrow = document.getElementById("categoryBtn");
  const dropdown = document.getElementById("selectCategory");
  if (!changeArrow || !dropdown) return;
  dropdown.classList.toggle("open");
  if (dropdown.classList.contains("open")) {
    changeArrow.style.backgroundImage = "url('../assets/img/arrowUup.svg')";
  } else {
    changeArrow.style.backgroundImage = "url('../assets/img/arrow_drop_down-icon.svg')";
  }
}

/**
 * Applies the selected category label to the category button and validates the selection.
 * @returns {void}
 */
function categorySelector() {
  const selected = document.querySelector('input[name="priorityCategory"]:checked');
  const label = selected ? selected.value : "Select task category";
  const button = document.getElementById("categoryBtn");
  const dropdown = document.getElementById("selectCategory");
  if (!button || !dropdown) return;
  button.textContent = label;
  dropdown.classList.remove("open");
  categorySelectorCheck();
}

/**
 * Validates category selection and updates visual state on the category button.
 * @returns {void}
 */
function categorySelectorCheck() {
  const selected = document.querySelector('input[name="priorityCategory"]:checked');
  const value = selected ? selected.value.trim() : "";
  valid.category = value === "Technical Task" || value === "User Story";
  const button = document.getElementById("categoryBtn");
  const errorFeedBack = document.getElementById("errorCategory");
  if (!button || !errorFeedBack) return;
  if (valid.category) {
    button.classList.add("input-focus");
    errorFeedBack.style.visibility = "hidden";
    button.classList.remove("input-error");
  } else {
    button.classList.remove("input-focus");
    errorFeedBack.style.visibility = "visible";
    button.classList.add("input-error");
  }
}

/**
 * Updates the create button UI state based on current validation flags.
 * @returns {void}
 */
function isValid() {
  const button = document.getElementById("colorChange");
  if (!button) return;
  const allValid = Object.values(valid).every((value) => value === true);
  if (allValid) {
    button.classList.remove("btn-State", "no-hover");
    button.classList.add("btn-clear");
    button.style.cursor = "pointer";
    button.disabled = false;
  } else {
    button.classList.remove("btn-clear");
    button.classList.add("btn-State", "no-hover");
    button.style.cursor = "not-allowed";
    button.disabled = true;
  }
}

/**
 * Checks if the current task title already exists in fetched tasks.
 * Shows an error message if a duplicate is found.
 * @returns {void}
 */
function titleDuplicateCheck() {
  const titleInput = document.getElementById("title");
  if (!titleInput) return;
  const inputValue = titleInput.value.trim().toLowerCase();
  const taskArray = Object.values(fetchData?.tasks || {});
  const isDuplicate = taskArray.some(task => 
    (task.title || "").toLowerCase() === inputValue && inputValue !== ""
  );
  const htmlFeedback = document.querySelector(".invalid-feedback");
  if (!htmlFeedback) return;
  if (isDuplicate) {
    htmlFeedback.innerHTML = "Oops! That title is already in use. Try a different one?";
    htmlFeedback.style.visibility = "visible";
    valid.title = false;
  } else {
    htmlFeedback.style.visibility = "hidden";
    if (titleInput.value.trim()) valid.title = true;
  }
}

/**
 * Reads values from the add-task form and builds a task payload.
 * @returns {TaskPayload}
 */
function getDataFromPage() {
  const inputs = document.querySelectorAll("#title, #description, #duedate");
  inputs.forEach((input) => {
    taskData[input.id] = input.value;
  });
  const selectedCategory = document.querySelector('input[name="priorityCategory"]:checked');
  taskData.category = selectedCategory ? selectedCategory.value : "";
  taskData.contacts = contactsState.filter((contact) => contact.checked);
  taskData.subtasks = subTaskInput.slice();
  const priority = document.querySelector('input[name="priority"]:checked');
  taskData.priority = priority ? priority.value : "medium";
  return /** @type {TaskPayload} */ (taskData);
}