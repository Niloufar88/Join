// Touch-Drag-State für mobile Geräte
let touchDraggedElement = null;
let touchDraggedId = null;
let touchStartX = 0;
let touchStartY = 0;
let isDragging = false;
const DRAG_THRESHOLD = 10; // Minimale Bewegung in Pixel, um Drag zu aktivieren

/**
 * Loads data, normalizes missing task fields, renders the board and initializes subtasks.
 * @async
 * @returns {Promise<void>}
 */
async function boardInit() {
  await getData();
  stateAdd();
  renderBoard();
  updateAllEmptyMessages();
  await subTasksStateAdd();
  initSearch();
}

/**
 * Attaches drag-and-drop listeners to all board columns that expose a `data-status` attribute.
 * Also adds touch event listeners for mobile devices.
 * @returns {void}
 */
function initDragAndDrop() {
  // Drag-and-Drop für Desktop
  document.querySelectorAll(".in-progress[data-status]").forEach((col) => {
    col.addEventListener("dragover", onDragOver);
    col.addEventListener("dragenter", onDragEnter);
    col.addEventListener("dragleave", onDragLeave);
    col.addEventListener("drop", onDrop);

    // Touch-Events für Mobile
    col.addEventListener("touchmove", onTouchMove, { passive: false });
    col.addEventListener("touchend", onTouchEnd);
  });

  // Touch-Events für alle Task-Cards hinzufügen
  initTouchOnCards();
}

/**
 * Attaches touch event listeners to all task cards for mobile drag functionality.
 * @returns {void}
 */
function initTouchOnCards() {
  document.querySelectorAll(".cards[data-id]").forEach((card) => {
    card.addEventListener("touchstart", onTouchStart, { passive: false });
  });
}

/**
 * Ensures that each task has a `state` field.
 * If missing, a default state is applied.
 * @returns {void}
 */
function stateAdd() {
  if (!fetchData?.tasks) return;
  Object.values(fetchData.tasks).forEach((task) => {
    if (task.state === undefined) task.state = "todu";
  });
}

/**
 * Collects tasks matching the provided state.
 * @param {"todu"|"inProgress"|"feedBack"|"done"|string} state
 * @returns {Array<{id: string, task: Task}>}
 */
function taskByState(state) {
  if (!fetchData?.tasks) return [];
  const entries = Object.entries(fetchData.tasks);
  const result = [];
  for (const [id, task] of entries) {
    if (task.state === state) result.push({ id, task });
  }
  return result;
}

/**
 * Renders the board columns based on task states and initializes drag-and-drop.
 * @returns {void}
 */
function renderBoard() {
  const todo = taskByState("todu");
  const inProgress = taskByState("inProgress");
  const feedBack = taskByState("feedBack");
  const done = taskByState("done");
  maincardHTML("toduContainer", todo);
  maincardHTML("inProgressContainer", inProgress);
  maincardHTML("feedBackContainer", feedBack);
  maincardHTML("doneContainer", done);
  initDragAndDrop();
}

/**
 * Renders a column header (title + count).
 * @param {string} headId
 * @param {string} title
 * @param {number} count
 * @returns {void}
 */
function headRenderHTML(headId, title, count) {
  const contentHead = document.getElementById(headId);
  if (!contentHead) return;
  contentHead.innerHTML = headcardHTML(title, count);
}

/**
 * Renders task cards into a column container.
 * @param {string} contentId
 * @param {Array<{id: string, task: Task}>} tasks
 * @returns {void}
 */
function maincardHTML(contentId, tasks) {
  const contentRef = document.getElementById(contentId);
  if (!contentRef) return;

  let html = "";
  for (let i = 0; i < tasks.length; i++) {
    html += renderTasksHTML(tasks[i].task, tasks[i].id);
  }
  contentRef.innerHTML = html;
}

/**
 * Renders avatar HTML for checked contacts.
 * @param {Contact[]} [contacts=[]]
 * @returns {string}
 */
function renderTaskContact(contacts = [], maxVisible = 4) {
  let html = "";
  const checkedContacts = contacts.filter(c => c.checked);
  const totalChecked = checkedContacts.length;
  for (let i = 0; i < checkedContacts.length; i++) {
    if (i < maxVisible) {
      html += renderContactAvatarHTML(checkedContacts[i]);
    } else if (i === maxVisible) {
      const remaining = totalChecked - maxVisible;
      html += `
        <div class="avatar" style="background-color: #ffffff; color: #2a3647;">
          +${remaining}
        </div>
      `;
    }
  }
  return html;
}

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
 * Persists the current `fetchData` state to the backend using PATCH.
 * @async
 * @returns {Promise<any>}
 * @throws {Error} If the HTTP response is not OK.
 */
async function postState() {
  const response = await fetch(`${BASE_URL}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fetchData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

/**
 * Drag start handler: stores the card id in the dataTransfer and marks the element.
 * @param {DragEvent} e
 * @returns {void}
 */
function onDragStart(e) {
  const card = /** @type {HTMLElement} */ (e.currentTarget);
  const id = card.getAttribute("data-id") || "";
  e.dataTransfer.setData("text/plain", id);
  e.dataTransfer.effectAllowed = "move";
  card.classList.add("dragging");
}

/**
 * Drag end handler: removes the dragging marker.
 * @param {DragEvent} e
 * @returns {void}
 */
function onDragEnd(e) {
  const card = /** @type {HTMLElement} */ (e.currentTarget);
  card.classList.remove("dragging");
}

/**
 * Drag over handler: enables dropping.
 * @param {DragEvent} e
 * @returns {void}
 */
function onDragOver(e) {
  e.preventDefault();
  updateAllEmptyMessages();
}

/**
 *
 * @param {DragEvent} e
 */
function onDragEnter(e) {
  e.preventDefault();
  const col = e.currentTarget;
  col.classList.add("drop-target");
}

/**
 *
 * @param {DragEvent} e
 */
function onDragLeave(e) {
  const col = e.currentTarget;
  if (!col.contains(e.relatedTarget)) {
    col.classList.remove("drop-target");
  }
}

/**
 * Drop handler: updates the task state based on the column and persists changes.
 * @async
 * @param {DragEvent} e
 * @returns {Promise<void>}
 */
async function onDrop(e) {
  e.preventDefault();
  const col = /** @type {HTMLElement} */ (e.currentTarget);
  const newState = col.getAttribute("data-status") || "";
  const cardId =
    e.dataTransfer.getData("text/plain") || e.dataTransfer.getData("text");
  if (fetchData?.tasks?.[cardId]) {
    fetchData.tasks[cardId].state = /** @type {any} */ (newState);
    await postState();
  }
  col.classList.remove("drop-target");
  renderBoard();
  updateAllEmptyMessages();
}

/**
 * Touch start handler for mobile drag functionality.
 * @param {TouchEvent} e
 * @returns {void}
 */
function onTouchStart(e) {
  const card = /** @type {HTMLElement} */ (e.currentTarget);
  const touch = e.touches[0];

  touchDraggedElement = card;
  touchDraggedId = card.getAttribute("data-id") || "";
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  isDragging = false;

  // KEIN preventDefault() hier - ermöglicht horizontales Scrollen
}

/**
 * Touch move handler: visualizes drop target on mobile.
 * @param {TouchEvent} e
 * @returns {void}
 */
function onTouchMove(e) {
  if (!touchDraggedElement) return;

  const touch = e.touches[0];
  const deltaX = Math.abs(touch.clientX - touchStartX);
  const deltaY = Math.abs(touch.clientY - touchStartY);

  // Prüfe ob Bewegung vertikal (Drag) oder horizontal (Scroll) ist
  if (!isDragging) {
    if (deltaY > DRAG_THRESHOLD && deltaY > deltaX) {
      // Vertikale Bewegung = Drag aktivieren
      isDragging = true;
      touchDraggedElement.classList.add("dragging");
    } else if (deltaX > DRAG_THRESHOLD) {
      // Horizontale Bewegung = Scroll, Drag abbrechen
      touchDraggedElement = null;
      touchDraggedId = null;
      return;
    } else {
      // Noch keine klare Richtung
      return;
    }
  }

  // Nur bei aktivem Drag preventDefault aufrufen
  if (isDragging) {
    e.preventDefault();

    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);

    // Entferne alle drop-target Klassen
    document.querySelectorAll(".drop-target").forEach((el) => {
      el.classList.remove("drop-target");
    });

    // Finde die nächste Column unter dem Touch-Punkt
    const column = elementUnderTouch?.closest(".in-progress[data-status]");
    if (column) {
      column.classList.add("drop-target");
    }
  }
}

/**
 * Touch end handler: completes the drag operation on mobile.
 * @async
 * @param {TouchEvent} e
 * @returns {Promise<void>}
 */
async function onTouchEnd(e) {
  if (!touchDraggedElement || !touchDraggedId) return;

  // Nur wenn wirklich gedragged wurde, Task verschieben
  if (isDragging) {
    const touch = e.changedTouches[0];
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetColumn = elementUnderTouch?.closest(".in-progress[data-status]");

    if (targetColumn) {
      const newState = targetColumn.getAttribute("data-status") || "";
      if (fetchData?.tasks?.[touchDraggedId]) {
        fetchData.tasks[touchDraggedId].state = /** @type {any} */ (newState);
        await postState();
      }
      targetColumn.classList.remove("drop-target");
    }

    touchDraggedElement.classList.remove("dragging");
    renderBoard();
    updateAllEmptyMessages();
  }

  // Cleanup
  touchDraggedElement = null;
  touchDraggedId = null;
  isDragging = false;
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
 * Reads the board search input and filters tasks by title.
 * Only runs if the board page exists (board-container is present).
 * If the input has less than 3 characters, the full board will be rendered again.
 * @returns {void}
 */
function searchBar() {
  const input = document.querySelector("#searchInput");
  const inputRes = document.querySelector("#searchInputResponsive")
  const board = document.querySelector(".board-container");
  if (!board || !input || !inputRes || !fetchData?.tasks) return;
  const q = input.value.trim().toLowerCase() || inputRes.value.trim().toLowerCase();
  if (q.length < 3) {
    renderBoard();
    updateAllEmptyMessages();
    return;
  }
  const filtered = Object.entries(fetchData.tasks).filter(([id, task]) => {
    const titleMatch =
      typeof task?.title === "string" && task.title.toLowerCase().includes(q);
    const descMatch =
      typeof task?.description === "string" &&
      task.description.toLowerCase().includes(q);
    return titleMatch || descMatch;
  });
  renderBoardFromEntries(filtered);
  updateAllEmptyMessages();
}

/**
 * Renders the board using a filtered list of task entries.
 * Each entry must be a tuple of [taskId, taskObject].
 * @param {Array<[string, any]>} entries - Filtered tasks as [id, task] pairs.
 * @returns {void}
 */
function renderBoardFromEntries(entries) {
  const tasks = entries.map(([id, task]) => ({ id, task }));
  const todo = tasks.filter((t) => t.task.state === "todu");
  const inProgress = tasks.filter((t) => t.task.state === "inProgress");
  const feedBack = tasks.filter((t) => t.task.state === "feedBack");
  const done = tasks.filter((t) => t.task.state === "done");
  maincardHTML("toduContainer", todo);
  maincardHTML("inProgressContainer", inProgress);
  maincardHTML("feedBackContainer", feedBack);
  maincardHTML("doneContainer", done);
  initDragAndDrop();
}

/**
 * Binds the search input listener on the board page.
 * Should be called once during board initialization.
 * @returns {void}
 */
function initSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  input.addEventListener("input", searchBar);
}

/**
 * Opens the task details overlay for the given card element.
 * @param {Element} el
 * @returns {void}
 */
function openTaskDetailsOverlay(el) {
  const taskID = (el.getAttribute("data-id") || "").trim();
  const task = fetchData?.tasks?.[taskID];
  if (!task) return;
  const wrapper = document.getElementById("taskDetailsOverlay");
  if (!wrapper) return;
  let contentRef = document.getElementById("contentRefTaskCard");
  if (!contentRef) {
    wrapper.innerHTML = `<div id="contentRefTaskCard"></div>`;
    contentRef = document.getElementById("contentRefTaskCard");
    if (!contentRef) return;
  }
  contentRef.innerHTML = taskPopup(task, taskID);
  wrapper.style.display = "flex";
  document.body.style.overflow = "hidden";
}

/**
 * Closes the task details overlay and re-renders the board.
 * @returns {void}
 */
function closetaskDetailsOverlay() {
  const wrapper = document.getElementById("taskDetailsOverlay");
  if (!wrapper) return;
  wrapper.style.display = "none";
  wrapper.innerHTML = "";
  document.body.style.overflow = "auto";
  renderBoard();
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
 * Renders detailed contact entries for checked contacts.
 * @param {Contact[]} [contacts=[]]
 * @returns {string}
 */
function renderTaskContactDetails(contacts = []) {
  let html = "";
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].checked) html += renderTaskContactDetailsHTML(contacts[i]);
  }
  return html;
}

/**
 * Renders the subtasks list for a task.
 * @param {string} taskId
 * @returns {string}
 */
function renderTaskSubTaskDetails(taskId) {
  const task = fetchData?.tasks?.[taskId];
  if (!task?.subtasks || !Array.isArray(task.subtasks)) return "";
  let html = "";
  for (let i = 0; i < task.subtasks.length; i++) {
    html += renderTaskSubTaskDetailsHTML(task.subtasks[i], i, taskId);
  }
  return html;
}

function getSubtaskStats(task) {
  const subtasks = task.subtasks || [];
  const total = subtasks.length;
  const checked = subtasks.filter((sub) => sub.state === "check").length;
  return { total, checked };
}

/**
 * Toggles a subtask state and persists the updated data.
 * @async
 * @param {string} taskId
 * @param {number} subtaskIndex
 * @returns {Promise<void>}
 */
async function toggleSubtask(taskId, subtaskIndex) {
  const task = fetchData?.tasks?.[taskId];
  if (!task?.subtasks?.[subtaskIndex]) return;
  const subtask = task.subtasks[subtaskIndex];
  subtask.state = subtask.state === "uncheck" ? "check" : "uncheck";
  await postState();
}

/**
 * Normalizes subtasks so each entry is an object with `title` and `state`, then persists changes.
 * @async
 * @returns {Promise<void>}
 */
async function subTasksStateAdd() {
  if (!fetchData?.tasks) return;
  Object.values(fetchData.tasks).forEach((task) => {
    if (!Array.isArray(task.subtasks)) return;
    task.subtasks = task.subtasks.map((subtask) => {
      if (typeof subtask === "string")
        return { title: subtask, state: "uncheck" };
      if (subtask.state === undefined) subtask.state = "uncheck";
      return subtask;
    });
  });
  await postState();
}

/**
 * Deletes a task, closes the overlay and persists the change.
 * @async
 * @param {string} id
 * @returns {Promise<void>}
 */
async function deleteTaskOnBoard(id) {
  if (!fetchData?.tasks?.[id]) return;
  delete fetchData.tasks[id];
  closetaskDetailsOverlay();
  renderBoard();
  await postState();
}

/**
 * Renders edit-mode subtasks directly into the DOM using the global subTaskInput array.
 * Searches within the taskDetailsOverlay to avoid conflicts with Add Task overlay.
 * @param {string} id - Task ID for the edit handlers
 * @returns {void}
 */
function renderSubtasksDetailsEdit(id) {
  // Search within the task details overlay to avoid conflicts
  const taskDetailsOverlay = document.getElementById("taskDetailsOverlay");
  const searchContext = taskDetailsOverlay || document;

  const subTaskContent = searchContext.querySelector("#SubtaskList");
  if (!subTaskContent) return;

  if (!subTaskInput || subTaskInput.length === 0) {
    subTaskContent.innerHTML = "";
    return;
  }

  let html = "";
  for (let i = 0; i < subTaskInput.length; i++) {
    const title = subTaskInput[i];
    if (!title) continue;
    // Create temporary subtask object for template rendering
    html += renderSubtasksDetailsEditHTML({ title, state: "uncheck" }, i, id);
  }
  subTaskContent.innerHTML = html;
}

/**
 * Deletes a subtask in edit mode and re-renders the subtask list.
 * @param {string} taskId
 * @param {number} i
 * @returns {void}
 */
function editDeleteSubtask(taskId, i) {
  subTaskInput.splice(i, 1);
  renderSubtasksDetailsEdit(taskId);

  const focusinput = document.getElementById("subtasks");
  if (focusinput) focusinput.focus();
}

/**
 * Updates a subtask edit view in-place by replacing its HTML with the edit template.
 * @param {string} taskId
 * @param {number} i
 * @returns {void}
 */
function editChangeSubtask(taskId, i) {
  const subContainer = document.querySelector(
    `.sub-container[data-index="${i}"]`,
  );
  if (!subContainer) return;
  if (!subTaskInput[i]) return;
  const currentValue = subTaskInput[i];
  subContainer.innerHTML = changeSubtaskHtml(i, currentValue);
  const newInputField = document.getElementById(`edit-input-${i}`);
  if (newInputField) newInputField.focus();
}

/**
 * Opens the edit mode overlay for one task.
 * @param {string} id Firebase task id
 * @returns {void}
 */
function editTaskOnBoard(id) {
  try {
    const task = fetchData?.tasks?.[id];
    const overlay = document.getElementById("taskDetailsOverlay");
    if (!task || !overlay) return;
    loadEditState(task);
    overlay.innerHTML = taskPopupEditMode(task, id);
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
    renderContact();
    assignedToLettersCheckContact();
    renderSubtasksDetailsEdit(id); // Renders subtasks into #SubtaskList
  } catch (error) {
    console.error("Error opening task edit mode:", error);
    document.body.style.overflow = "auto";
  }
  bindAddTaskListeners(document);
}

/**
 * Loads task values into the global edit states.
 * @param {any} task
 * @returns {void}
 */
function loadEditState(task) {
  subTaskInput = (task.subtasks || []).map((s) =>
    typeof s === "string" ? s : s.title,
  );
  const assignedIds = new Set((task.contacts || []).map((c) => c.id));
  contactsState = contactsState.map((c) => ({
    ...c,
    checked: assignedIds.has(c.id),
  }));
}

/**
 * Reads an input/textarea value by id.
 * @param {string} id
 * @returns {string}
 */
function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

/**
 * Reads the checked radio value of a group.
 * @param {string} name
 * @param {string} fallback
 * @returns {string}
 */
function getCheckedValue(name, fallback = "") {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : fallback;
}

/**
 * Saves the edited task and updates Firebase.
 * Preserves existing subtask states instead of resetting them.
 * @param {string} id Firebase task id
 * @returns {Promise<void>}
 */
async function saveEditedTask(id) {
  try {
    const task = fetchData?.tasks?.[id];
    if (!task) return;

    task.title = getValue("title");
    task.description = getValue("description");
    task.duedate = getValue("duedate");
    task.priority = getCheckedValue("priority", task.priority);
    task.category = getCheckedValue("priorityCategory", task.category);
    task.contacts = contactsState.filter((c) => c.checked);

    const existingSubtasks = task.subtasks || [];
    task.subtasks = subTaskInput.map((title, index) => {
      const existing = existingSubtasks.find((s) => s.title === title);
      return {
        title,
        state: existing?.state || "uncheck",
      };
    });

    await postState();
    closetaskDetailsOverlay();
    renderBoard();
  } catch (error) {
    console.error("Error saving edited task:", error);
    alert("Fehler beim Speichern der Aufgabe. Bitte versuchen Sie es erneut.");
  }
}
