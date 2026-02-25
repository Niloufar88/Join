let addTaskListenersBound = false;

/**
 * Registers all event listeners for the add-task page.
 * @param {HTMLElement} [document]
 * @returns {void}
 */
function bindAddTaskListeners(document) {
  if (addTaskListenersBound) return;
  addTaskListenersBound = true;
  document.addEventListener("click", handleGlobalClickContact);
  document.addEventListener("click", handleGlobalClickCategory);
  document.addEventListener("click", handleGlobalClick);
  document.addEventListener("input", handleGlobalInput);
  document.addEventListener("focusin", handleGlobalFocusIn);
  document.addEventListener("focusout", handleGlobalFocusOut);
  document.addEventListener("keydown", handleGlobalKeyDown);
}

/**
 * Removes all event listeners for the add-task page.
 * @param {HTMLElement} [document]
 * @returns {void}
 */
function unbindAddTaskListeners(document) {
  if (!addTaskListenersBound) return;
  addTaskListenersBound = false;
  document.removeEventListener("click", handleGlobalClickContact);
  document.removeEventListener("click", handleGlobalClickCategory);
  document.removeEventListener("click", handleGlobalClick);
  document.removeEventListener("input", handleGlobalInput);
  document.removeEventListener("focusin", handleGlobalFocusIn);
  document.removeEventListener("focusout", handleGlobalFocusOut);
  document.removeEventListener("keydown", handleGlobalKeyDown);
}

/**
 * Handles global click events: closes dropdowns if clicked outside.
 * @param {MouseEvent} e
 * @returns {void}
 */
function handleGlobalClick(e) {
  const activeOverlay = getActiveOverlay();
  let subtaskBox = activeOverlay
    ? activeOverlay.querySelector("#showHiddenSubtasks")
    : null;
  if (!subtaskBox) subtaskBox = document.getElementById("showHiddenSubtasks");
  if (subtaskBox && !e.target.closest(".input-wrapper")) {
    subtaskBox.style.display = "none";
  }
}

/**
 * Handles global click events: closes dropdowns if clicked outside.
 * @param {MouseEvent} e
 * @returns {void}
 */
function handleGlobalClickCategory(e) {
  let categoryDropdown = getActiveOverlay()
    ? activeOverlay.querySelector("#selectCategory")
    : null;
  let categoryBtn = getActiveOverlay()
    ? activeOverlay.querySelector("#categoryBtn")
    : null;
  if (!categoryDropdown)
    categoryDropdown = document.getElementById("selectCategory");
  if (!categoryBtn) categoryBtn = document.getElementById("categoryBtn");
  if (categoryDropdown && categoryBtn) {
    const inside =
      categoryDropdown.contains(e.target) || categoryBtn.contains(e.target);
    if (!inside) {
      categoryDropdown.classList.remove("open");
      categoryBtn.classList.remove("input-focus");
    }
  }
  if (typeof isValid === "function") isValid();
}

/**
 * Handles global click events: closes dropdowns if clicked outside.
 * @param {MouseEvent} e
 * @returns {void}
 */
function handleGlobalClickContact(e) {
  let contactsDropdown = getActiveOverlay()
    ? activeOverlay.querySelector("#selectContacts") : null;
  let contactsBtn = getActiveOverlay()
    ? activeOverlay.querySelector("#BTNToggleContacts") : null;
  if (!contactsDropdown)
    contactsDropdown = document.getElementById("selectContacts");
  if (!contactsBtn) contactsBtn = document.getElementById("BTNToggleContacts");
  if (contactsDropdown && contactsBtn) {
    const inside =
      contactsDropdown.contains(e.target) || contactsBtn.contains(e.target);
    if (!inside) closeAssigned();
  }
}

/**
 * Handles global input events: filters contacts on search.
 * @param {InputEvent} e
 * @returns {void}
 */
function handleGlobalInput(e) {
  if (e.target?.id === "searchContacts") contactSearch();
}

/**
 * Handles global focusin events: shows subtask box, validates inputs.
 * @param {FocusEvent} e
 * @returns {void}
 */
function handleGlobalFocusIn(e) {
  if (!e.target) return;
  if (e.target.id === "subtasks") {
    const activeOverlay = getActiveOverlay();
    let subtaskBox = activeOverlay
      ? activeOverlay.querySelector("#showHiddenSubtasks")
      : null;
    if (!subtaskBox) subtaskBox = document.getElementById("showHiddenSubtasks");
    if (subtaskBox) subtaskBox.style.display = "flex";
  }
  if (e.target.id === "title" || e.target.id === "duedate") onFocus(e);
}

/**
 * Handles global focusout events: validates inputs on blur.
 * @param {FocusEvent} e
 * @returns {void}
 */
function handleGlobalFocusOut(e) {
  if (!e.target) return;
  if (e.target.id === "title" || e.target.id === "duedate") validateOnBlur(e);
}

/**
 * Handles global keydown events: adds subtask on Enter.
 * @param {KeyboardEvent} e
 * @returns {void}
 */
function handleGlobalKeyDown(e) {
  if (e.target?.id === "subtasks" && e.key === "Enter") {
    e.preventDefault();
    addSubtask();
  }
}
