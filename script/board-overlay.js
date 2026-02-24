/**
 * Öffnet das Overlay zum Erstellen einer neuen Aufgabe.
 * Lädt das Formular in das Overlay, initialisiert die Daten und deaktiviert das Body-Scrolling.
 * @async
 * @returns {Promise<void>}
 */
async function openAddTaskOverlay() {
  try {
    const overlay = document.getElementById("addTaskOverlay");
    if (!overlay) {
      return;
    }
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
 * Initialisiert die Add-Task-Ansicht: lädt benötigte Daten und registriert Event-Handler.
 * @async
 * @returns {Promise<void>}
 */
async function addTaskinit() {
  await getData();
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
      if (event.target === addTaskOverlayEl) {
        closeAddTaskOverlay();
      }
    });
  }

  const taskDetailsOverlayEl = document.getElementById("taskDetailsOverlay");
  if (taskDetailsOverlayEl) {
    taskDetailsOverlayEl.addEventListener("click", (event) => {
      if (event.target === taskDetailsOverlayEl) {
        closeTaskDetailsOverlay();
      }
    });
  }
}

// Initialize overlay handlers when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOverlayClickHandlers);
} else {
  initOverlayClickHandlers();
  unbindAddTaskListeners();
}
