let addTaskListenersBound = false;

/**
 * Registers all event listeners for the add-task page.
 * @param {HTMLElement} [root=document]
 * @returns {void}
 */
function bindAddTaskListeners(root = document) {
  if (addTaskListenersBound) return;
  addTaskListenersBound = true;
  root.addEventListener("click", handleGlobalClick);
  root.addEventListener("input", handleGlobalInput);
  root.addEventListener("focusin", handleGlobalFocusIn);
  root.addEventListener("focusout", handleGlobalFocusOut);
  root.addEventListener("keydown", handleGlobalKeyDown);
}

/**
 * Removes all event listeners for the add-task page.
 * @param {HTMLElement} [root=document]
 * @returns {void}
 */
function unbindAddTaskListeners(root = document) {
  if (!addTaskListenersBound) return;
  addTaskListenersBound = false;
  root.removeEventListener("click", handleGlobalClick);
  root.removeEventListener("input", handleGlobalInput);
  root.removeEventListener("focusin", handleGlobalFocusIn);
  root.removeEventListener("focusout", handleGlobalFocusOut);
  root.removeEventListener("keydown", handleGlobalKeyDown);
}

/**
 * Handles global click events: closes dropdowns if clicked outside.
 * @param {MouseEvent} e
 * @returns {void}
 */
function handleGlobalClick(e) {
  const activeOverlay = getActiveOverlay(); 
  let subtaskBox = activeOverlay ? activeOverlay.querySelector("#showHiddenSubtasks") : null;
  if (!subtaskBox) subtaskBox = document.getElementById("showHiddenSubtasks");
  if (subtaskBox && !e.target.closest(".input-wrapper")) {
    subtaskBox.style.display = "none";
  }

  let contactsDropdown = activeOverlay ? activeOverlay.querySelector("#selectContacts") : null;
  let contactsBtn = activeOverlay ? activeOverlay.querySelector("#BTNToggleContacts") : null;
  if (!contactsDropdown) contactsDropdown = document.getElementById("selectContacts");
  if (!contactsBtn) contactsBtn = document.getElementById("BTNToggleContacts");
  if (contactsDropdown && contactsBtn) {
    const inside = contactsDropdown.contains(e.target) || contactsBtn.contains(e.target);
    if (!inside) closeAssigned();
  }
 
  let categoryDropdown = activeOverlay ? activeOverlay.querySelector("#selectCategory") : null;
  let categoryBtn = activeOverlay ? activeOverlay.querySelector("#categoryBtn") : null;
  if (!categoryDropdown) categoryDropdown = document.getElementById("selectCategory");
  if (!categoryBtn) categoryBtn = document.getElementById("categoryBtn");
  if (categoryDropdown && categoryBtn) {
    const inside = categoryDropdown.contains(e.target) || categoryBtn.contains(e.target);
    if (!inside) {
      categoryDropdown.classList.remove("open");
      categoryBtn.classList.remove("input-focus");
    }
  }
  
  if (typeof isValid === "function") isValid();
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
    let subtaskBox = activeOverlay ? activeOverlay.querySelector("#showHiddenSubtasks") : null;
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