let touchDraggedElement = null;
let touchDraggedId = null;
let touchStartX = 0;
let touchStartY = 0;
let isDragging = false;
const DRAG_THRESHOLD = 10;

function stateAdd() {
  if (!fetchData?.tasks) return;
  Object.values(fetchData.tasks).forEach((task) => {
    if (task.state === undefined) task.state = "todu";
  });
}

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