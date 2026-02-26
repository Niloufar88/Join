/**
 * Initializes the add-task page: loads data, resets inputs and registers event handlers.
 * @async
 * @returns {Promise<void>}
 */
async function initAddTask() {
  await getData();   
  bindAddTaskListeners(document); 
}

/**
 * Creates a task by reading form data, posting it and resetting the UI.
 * @async
 * @returns {Promise<void>}
 */
async function createTask() {
  titleDuplicateCheck(); 
  if (!valid.title) return;  
  const payload = getDataFromPage(); 
  await postData(payload);
  clearInputs();
  popup();  
  setTimeout(() => {
    window.location.href = "../html/board.html";
  }, 2000);
}

/**
 * Initializes the application once the DOM is fully loaded.
 * Safely checks for the existence of the global `initAddTask` function before invoking it.
 *
 * @listens DOMContentLoaded
 * @requires {function} initAddTask - Optional global initialization function.
 */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof initAddTask === "function") {
    initAddTask();
  }
});