/**
 * Array storing temporary sub-task input data or form field values.
 * Used to collect sub-task entries before they are saved or submitted.
 * 
 * @global
 * @type {Array<string|Object>}
 * @default []
 */
let subTaskInput = [];

/**
 * Renders the contacts list inside the contacts dropdown.
 * @param {Contact[]} [list=contactsState]
 * @returns {void}
 */
function renderContact(list = contactsState) {
  const el = document.getElementById("selectContacts");
  if (!el) return;
  let content = "";
  for (const contact of list) {
    content += renderContactHTML(
      contact.initials,
      contact.name,
      contact.color,
      contact.id,
      contact.checked,
    );
  }
  el.innerHTML = content;
}

/**
 * Renders selected contacts initials into the assigned-to container.
 * @returns {void}
 */
function renderSelectedContactsInitials() {
  const container = document.getElementById("selectContact");
  if (!container) return;
  container.innerHTML = "";
  let contactCounter = 0;
  contactsState
    .filter((c) => c.checked)
    .forEach((c) => {
      contactCounter++;
      if (contactCounter <= 5) {
        container.innerHTML += letterInitials(c);
      } else if (contactCounter === 6) {
        const totalChecked = contactsState.filter((x) => x.checked).length;
        container.innerHTML += renderOverflowBadge(totalChecked - 5);
      }
    });
}

/**
 * Filters contacts by the search input and re-renders the list.
 * @returns {void}
 */
function contactSearch() {
  const input = document.getElementById("searchContacts");
  if (!input) return;
  const value = input.value.toLowerCase();
  if (value.length === 0) {
    renderContact();
    return;
  }
  const filtered = contactsState.filter((c) =>
    c.name.toLowerCase().includes(value),
  );
  renderContact(filtered);
}

/**
 * Opens the contacts dropdown and prepares the search input.
 * @returns {void}
 */
function toggleContacts() {
  renderContact();
  const search = document.getElementById("searchContacts");
  const dropdown = document.getElementById("selectContacts");
  const button = document.getElementById("BTNToggleContacts");
  const closeBtn = document.getElementById("closeAssigned");
  if (!search || !dropdown || !button || !closeBtn) return;
  search.value = "";
  dropdown.classList.add("open");
  button.style.display = "none";
  search.classList.remove("d-none");
  closeBtn.style.display = "flex";
  search.focus();
}

/**
 * Toggles the checked state of a contact by id and updates the assigned display.
 * @param {string|number} id
 * @returns {void}
 */
function toggleContact(id) {
  const contact = contactsState.find((c) => String(c.id) === String(id));
  if (!contact) return;
  contact.checked = !contact.checked;
  renderSelectedContactsInitials();
}

/**
 * Closes the contacts dropdown and resets related UI elements.
 * @returns {void}
 */
function closeAssigned() {
  const dropdown = document.getElementById("selectContacts");
  const button = document.getElementById("BTNToggleContacts");
  const search = document.getElementById("searchContacts");
  const closeBtn = document.getElementById("closeAssigned");
  if (!dropdown || !button || !search || !closeBtn) return;
  dropdown.classList.remove("open");
  button.style.display = "flex";
  search.classList.add("d-none");
  closeBtn.style.display = "none";
  search.value = "";
}

/**
 * Focuses the subtask input and toggles input icon classes.
 * @returns {void}
 */
function focusSubtaskInput() {
  let input = null;
  const activeOverlay = getActiveOverlay();
  if (activeOverlay) {
    input = activeOverlay.querySelector("#subtasks");
  }
  if (!input) {
    input = document.getElementById("subtasks");
  }
  if (!input) return;
  input.focus();
  input.classList.toggle("input-icon-cancel,input-icon-accept,seperator-small");
}

/**
 * Adds a new subtask from the input field to the list and re-renders the subtasks.
 * @returns {void}
 */
function addSubtask() {
  let subTask = null;
  const activeOverlay = getActiveOverlay();
  if (activeOverlay) {
    subTask = activeOverlay.querySelector("#subtasks");
  }
  if (!subTask) {
    subTask = document.getElementById("subtasks");
  }
  const subTaskValue = subTask.value.trim();
  if (subTaskValue) {
    subTaskInput.push(subTaskValue);
    renderSubtasks();
  }
  subTask.value = "";
  subTask.focus();
}

/**
 * Renders the current subtask list into the subtask container.
 * Only renders in the currently active/visible overlay.
 * @returns {void}
 */
function renderSubtasks() {
  const addTaskOverlay = document.getElementById("addTaskOverlay");
  const taskDetailsOverlay = document.getElementById("taskDetailsOverlay");
  let activeContainer = null;
  if (addTaskOverlay && addTaskOverlay.style.display === "flex") {
    activeContainer = addTaskOverlay;
  } else if (
    taskDetailsOverlay &&
    taskDetailsOverlay.style.display === "flex"
  ) {
    activeContainer = taskDetailsOverlay;
  }
  if (!activeContainer) {
    const subTaskContent = document.getElementById("SubtaskList");
    if (subTaskContent) renderSubtaskList(subTaskContent);
    return;
  }
  const subTaskContent = activeContainer.querySelector("#SubtaskList");
  if (!subTaskContent) return;
  renderSubtaskList(subTaskContent);
}

/**
 * Helper function to render subtasks into a specific container.
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderSubtaskList(container) {
  let htmlContent = "";
  for (let i = 0; i < subTaskInput.length; i++) {
    htmlContent += renderSubtaskItemHTML(subTaskInput[i], i);
  }
  container.innerHTML = htmlContent;
}

/**
 * Switches a subtask item into edit mode.
 * @param {number} i
 * @returns {void}
 */
function changeSubtask(i) {
  const activeOverlay = getActiveOverlay();
  const searchContext = activeOverlay || document;
  const newSubtask = searchContext.querySelector(
    `.sub-container[data-index="${i}"]`,
  );
  if (!newSubtask) return;
  const currentValue = subTaskInput[i] || "";
  newSubtask.innerHTML = renderEditSubtaskForm(i, currentValue);
  let newInputField = searchContext.querySelector(`#edit-input-${i}`);
  if (!newInputField)
    newInputField = document.getElementById(`edit-input-${i}`);
  if (newInputField) newInputField.focus();
}

/**
 * Saves an edited subtask value and re-renders the list.
 * @param {number} i
 * @returns {void}
 */
function saveSubtaskEdit(i) {
  const activeOverlay = getActiveOverlay();
  const searchContext = activeOverlay || document;
  let subEdit = searchContext.querySelector(`#edit-input-${i}`);
  if (!subEdit) subEdit = document.getElementById(`edit-input-${i}`);
  if (!subEdit) return;
  const newValue = subEdit.value.trim();
  if (newValue === "") {
    subTaskInput.splice(i, 1);
  } else {
    subTaskInput[i] = newValue;
  }
  renderSubtasks();
}

/**
 * Deletes a subtask at the given index and re-renders the list.
 * @param {number} i
 * @returns {void}
 */
function deleteSubtask(i) {
  subTaskInput.splice(i, 1);
  renderSubtasks();
  let focusInput = null;
  const activeOverlay = getActiveOverlay();
  if (activeOverlay) focusInput = activeOverlay.querySelector("#subtasks");
  if (!focusInput) focusInput = document.getElementById("subtasks");
  if (focusInput) focusInput.focus();
}

/**
 * Gets the currently active overlay element.
 * @returns {HTMLElement|null}
 */
function getActiveOverlay() {
  if (
    document.getElementById("addTaskOverlay") ||
    document.getElementById("taskDetailsOverlay")
  ) {
    return;
  }
  const addTaskOverlay = document.getElementById("addTaskOverlay");
  const taskDetailsOverlay = document.getElementById("taskDetailsOverlay");
  if (addTaskOverlay && addTaskOverlay.style.display === "flex")
    return addTaskOverlay;
  if (taskDetailsOverlay && taskDetailsOverlay.style.display === "flex")
    return taskDetailsOverlay;
  return null;
}

/**
 * Clears the subtask input and closes the subtask box.
 * @returns {void}
 */
function cancelSubtask() {
  let input = null;
  let box = null;
  const activeOverlay = getActiveOverlay();
  if (activeOverlay) {
    input = activeOverlay.querySelector("#subtasks");
    box = activeOverlay.querySelector("#showHiddenSubtasks");
  }
  if (!input) input = document.getElementById("subtasks");
  if (!box) box = document.getElementById("showHiddenSubtasks");
  if (!input || !box) return;
  input.value = "";
  input.focus();
  box.style.display = "";
}

/**
 * Resets all add-task inputs and UI states to defaults.
 * @returns {void}
 */
function clearInputs() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("duedate").value = "";
  document.getElementById("subtasks").value = "";
  document.getElementById("SubtaskList").innerHTML = "";
  document.getElementById("selectContact").innerHTML = "";
  const prioMedium = document.getElementById("prio-medium");
  const categoryBtn = document.getElementById("categoryBtn");
  if (prioMedium) prioMedium.checked = true;
  document
    .querySelectorAll('input[name="priorityCategory"]')
    .forEach((r) => (r.checked = false));
  if (categoryBtn) categoryBtn.textContent = "Select task category";
  subTaskInput = [];
  contactsState.forEach((contact) => {
    contact.checked = false;
  });
  unbindAddTaskListeners(document);
  bindAddTaskListeners(document);
}

/**
 * Shows the "task added" popup with an animation.
 * @returns {void}
 */
function popup() {
  const createPopUp = document.querySelector(".popup-added");
  if (!createPopUp) return;
  createPopUp.classList.remove("show");
  void createPopUp.offsetWidth;
  createPopUp.classList.add("show");
  setTimeout(popupHide, 2000);
}

/**
 * Hides the popup and resets its display after the animation.
 * @returns {void}
 */
function popupHide() {
  const popupEl = document.querySelector(".popup-added");
  if (!popupEl) return;
  popupEl.classList.remove("show");
  popupEl.classList.add("hide");
  setTimeout(() => {
    popupEl.classList.remove("hide");
    popupEl.style.display = "none";
  }, 300);
}
