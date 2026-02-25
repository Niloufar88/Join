async function InitBoard() {
  await getData();
  stateAdd();
  renderBoard();
  updateAllEmptyMessages();
  await subTasksStateAdd();
  initSearch();
}

function initDragAndDrop() {
  document.querySelectorAll(".in-progress[data-status]").forEach((col) => {
    col.addEventListener("dragover", onDragOver);
    col.addEventListener("dragenter", onDragEnter);
    col.addEventListener("dragleave", onDragLeave);
    col.addEventListener("drop", onDrop);
    col.addEventListener("touchmove", onTouchMove, { passive: false });
    col.addEventListener("touchend", onTouchEnd);
  });
  initTouchOnCards();
}

function initTouchOnCards() {
  document.querySelectorAll(".cards[data-id]").forEach((card) => {
    card.addEventListener("touchstart", onTouchStart, { passive: false });
  });
}

function taskByState(state) {
  if (!fetchData?.tasks) return [];
  const entries = Object.entries(fetchData.tasks);
  const result = [];
  for (const [id, task] of entries) {
    if (task.state === state) result.push({ id, task });
  }
  return result;
}

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

function searchBar() {
  const input = document.querySelector("#searchInput");
  const inputRes = document.querySelector("#searchInputResponsive");
  const board = document.querySelector(".board-container");
  if (!board || !input || !inputRes || !fetchData?.tasks) return;
  const q = input.value.trim().toLowerCase() || inputRes.value.trim().toLowerCase();
  if (q.length < 3) {
    renderBoard();
    updateAllEmptyMessages();
    return;
  }
  const filtered = Object.entries(fetchData.tasks).filter(([id, task]) => {
    const titleMatch = typeof task?.title === "string" && task.title.toLowerCase().includes(q);
    const descMatch = typeof task?.description === "string" && task.description.toLowerCase().includes(q);
    return titleMatch || descMatch;
  });
  renderBoardFromEntries(filtered);
  updateAllEmptyMessages();
}

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

// Global Init Execution
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOverlayClickHandlers);
} else {
  initOverlayClickHandlers();
  if (typeof unbindAddTaskListeners === 'function') unbindAddTaskListeners();
}