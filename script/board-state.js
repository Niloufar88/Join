/** @type {HTMLElement|null} */
let touchDraggedElement = null;
let touchDraggedId = null;
let touchStartX = 0;
let touchStartY = 0;
let isDragging = false;
const DRAG_THRESHOLD = 10;

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