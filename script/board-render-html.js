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

/**
 * Renders edit-mode subtasks directly into the DOM using the global subTaskInput array.
 * @param {string} id - Task ID for the edit handlers
 * @returns {void}
 */
function renderSubtasksDetailsEdit(id) {
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
    html += renderSubtasksDetailsEditHTML({ title, state: "uncheck" }, i, id);
  }
  subTaskContent.innerHTML = html;
}