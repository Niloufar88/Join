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

document.addEventListener("DOMContentLoaded", () => {
  if (typeof initAddTask === "function") {
    initAddTask();
  }
});