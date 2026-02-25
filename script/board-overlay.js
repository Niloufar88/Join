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
 * Öffnet das Overlay zum Erstellen einer neuen Aufgabe.
 * @async
 * @returns {Promise<void>}
 */
async function openAddTaskOverlay() {
  try {
    const overlay = document.getElementById("addTaskOverlay");
    if (!overlay) return;
    overlay.style.display = "flex";
    loadAddTaskFormIntoOverlay();
    await addTaskinit();
    clearInputs();
    bindAddTaskListeners(document);
    document.body.style.overflow = "hidden";
  } catch (error) {
    console.error("Error opening Add Task overlay:", error);
    document.body.style.overflow = "auto";
  }
  bindAddTaskListeners(document);
}

/**
 * Schließt das Add-Task-Overlay und stellt das Body-Scrolling wieder her.
 * @returns {void}
 */
function closeAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  if (!overlay) return;
  overlay.style.display = "none";
  document.body.style.overflow = "auto";
  clearInputs();
  renderBoard();
  document.getElementById("addTaskFormContainer").innerHTML = "";
}

/**
 * Closes the task details overlay and re-renders the board.
 * @returns {void}
 */
function closeTaskDetailsOverlay() {
  const wrapper = document.getElementById("taskDetailsOverlay");
  if (!wrapper) return;
  wrapper.style.display = "none";
  wrapper.innerHTML = "";
  document.body.style.overflow = "auto";
  renderBoard();
}

/**
 * Initializes overlay click-outside-to-close handlers after DOM is ready.
 * @returns {void}
 */
function initOverlayClickHandlers() {
  const addTaskOverlayEl = document.getElementById("addTaskOverlay");
  if (addTaskOverlayEl) {
    addTaskOverlayEl.addEventListener("click", (event) => {
      if (event.target === addTaskOverlayEl) closeAddTaskOverlay();
    });
  }
  const taskDetailsOverlayEl = document.getElementById("taskDetailsOverlay");
  if (taskDetailsOverlayEl) {
    taskDetailsOverlayEl.addEventListener("click", (event) => {
      if (event.target === taskDetailsOverlayEl) closeTaskDetailsOverlay();
    });
  }
}