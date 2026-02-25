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

function closetaskDetailsOverlay() {
  const wrapper = document.getElementById("taskDetailsOverlay");
  if (!wrapper) return;
  wrapper.style.display = "none";
  wrapper.innerHTML = "";
  document.body.style.overflow = "auto";
  renderBoard();
}

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

function closeAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  if (!overlay) return;
  overlay.style.display = "none";
  document.body.style.overflow = "auto";
  clearInputs();
  renderBoard();
  document.getElementById("addTaskFormContainer").innerHTML = "";
}

function closeTaskDetailsOverlay() {
  const wrapper = document.getElementById("taskDetailsOverlay");
  if (!wrapper) return;
  wrapper.style.display = "none";
  wrapper.innerHTML = "";
  document.body.style.overflow = "auto";
  renderBoard();
}

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