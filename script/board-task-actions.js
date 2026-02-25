async function toggleSubtask(taskId, subtaskIndex) {
  const task = fetchData?.tasks?.[taskId];
  if (!task?.subtasks?.[subtaskIndex]) return;
  const subtask = task.subtasks[subtaskIndex];
  subtask.state = subtask.state === "uncheck" ? "check" : "uncheck";
  await postState();
}

async function deleteTaskOnBoard(id) {
  if (!fetchData?.tasks?.[id]) return;
  delete fetchData.tasks[id];
  closetaskDetailsOverlay();
  renderBoard();
  await postState();
}

function editDeleteSubtask(taskId, i) {
  subTaskInput.splice(i, 1);
  renderSubtasksDetailsEdit(taskId);
  const focusinput = document.getElementById("subtasks");
  if (focusinput) focusinput.focus();
}

function editChangeSubtask(taskId, i) {
  const subContainer = document.querySelector(`.sub-container[data-index="${i}"]`);
  if (!subContainer || !subTaskInput[i]) return;
  const currentValue = subTaskInput[i];
  subContainer.innerHTML = renderEditSubtaskForm(i, currentValue);
  const newInputField = document.getElementById(`edit-input-${i}`);
  if (newInputField) newInputField.focus();
}

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
    renderSelectedContactsInitials();
    renderSubtasksDetailsEdit(id);
  } catch (error) {
    console.error("Error opening task edit mode:", error);
    document.body.style.overflow = "auto";
  }
  bindAddTaskListeners(document);
}

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
      return { title, state: existing?.state || "uncheck" };
    });
    await postState();
    closetaskDetailsOverlay();
    renderBoard();
  } catch (error) {
    console.error("Error saving edited task:", error);
    alert("Fehler beim Speichern der Aufgabe. Bitte versuchen Sie es erneut.");
  }
}