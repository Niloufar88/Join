function onDragStart(e) {
  const card = e.currentTarget;
  const id = card.getAttribute("data-id") || "";
  e.dataTransfer.setData("text/plain", id);
  e.dataTransfer.effectAllowed = "move";
  card.classList.add("dragging");
}

function onDragEnd(e) {
  const card = e.currentTarget;
  card.classList.remove("dragging");
}

function onDragOver(e) {
  e.preventDefault();
  updateAllEmptyMessages();
}

function onDragEnter(e) {
  e.preventDefault();
  const col = e.currentTarget;
  col.classList.add("drop-target");
}

function onDragLeave(e) {
  const col = e.currentTarget;
  if (!col.contains(e.relatedTarget)) {
    col.classList.remove("drop-target");
  }
}

async function onDrop(e) {
  e.preventDefault();
  const col = e.currentTarget;
  const newState = col.getAttribute("data-status") || "";
  const cardId = e.dataTransfer.getData("text/plain") || e.dataTransfer.getData("text");
  if (fetchData?.tasks?.[cardId]) {
    fetchData.tasks[cardId].state = newState;
    await postState();
  }
  col.classList.remove("drop-target");
  renderBoard();
  updateAllEmptyMessages();
}

function onTouchStart(e) {
  const card = e.currentTarget;
  const touch = e.touches[0];
  touchDraggedElement = card;
  touchDraggedId = card.getAttribute("data-id") || "";
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  isDragging = false;
}

function onTouchMove(e) {
  if (!touchDraggedElement) return;
  const touch = e.touches[0];
  const deltaX = Math.abs(touch.clientX - touchStartX);
  const deltaY = Math.abs(touch.clientY - touchStartY);
  if (!isDragging) {
    if (deltaY > DRAG_THRESHOLD && deltaY > deltaX) {
      isDragging = true;
      touchDraggedElement.classList.add("dragging");
    } else if (deltaX > DRAG_THRESHOLD) {
      touchDraggedElement = null;
      touchDraggedId = null;
      return;
    } else return;
  }
  if (isDragging) {
    e.preventDefault();
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
    document.querySelectorAll(".drop-target").forEach((el) => el.classList.remove("drop-target"));
    const column = elementUnderTouch?.closest(".in-progress[data-status]");
    if (column) column.classList.add("drop-target");
  }
}

async function onTouchEnd(e) {
  if (!touchDraggedElement || !touchDraggedId) return;
  if (isDragging) {
    const touch = e.changedTouches[0];
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetColumn = elementUnderTouch?.closest(".in-progress[data-status]");
    if (targetColumn) {
      const newState = targetColumn.getAttribute("data-status") || "";
      if (fetchData?.tasks?.[touchDraggedId]) {
        fetchData.tasks[touchDraggedId].state = newState;
        await postState();
      }
      targetColumn.classList.remove("drop-target");
    }
    touchDraggedElement.classList.remove("dragging");
    renderBoard();
    updateAllEmptyMessages();
  }
  touchDraggedElement = null;
  touchDraggedId = null;
  isDragging = false;
}

function initSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  input.addEventListener("input", searchBar);
}