/** @type {HTMLElement|null} */
let touchDraggedElement = null;
let touchDraggedId = null;
let touchStartX = 0;
let touchStartY = 0;
let isDragging = false;
const DRAG_THRESHOLD = 10;

/**
 * Drag start handler: stores the card id in the dataTransfer and marks the element.
 * @param {DragEvent} e
 */
function onDragStart(e) {
  const card = e.currentTarget;
  const id = card.getAttribute("data-id") || "";
  e.dataTransfer.setData("text/plain", id);
  e.dataTransfer.effectAllowed = "move";
  card.classList.add("dragging");
}

/**
 * Drag end handler: removes the dragging marker.
 * @param {DragEvent} e
 */
function onDragEnd(e) {
  const card = e.currentTarget;
  card.classList.remove("dragging");
}

/**
 * Drag over handler: enables dropping.
 * @param {DragEvent} e
 */
function onDragOver(e) {
  e.preventDefault();
  updateAllEmptyMessages();
}

/**
 * @param {DragEvent} e
 */
function onDragEnter(e) {
  e.preventDefault();
  const col = e.currentTarget;
  col.classList.add("drop-target");
}

/**
 * @param {DragEvent} e
 */
function onDragLeave(e) {
  const col = e.currentTarget;
  if (!col.contains(e.relatedTarget)) {
    col.classList.remove("drop-target");
  }
}

/**
 * Drop handler: updates the task state based on the column and persists changes.
 * @async
 * @param {DragEvent} e
 */
async function onDrop(e) {
  e.preventDefault();
  const col = e.currentTarget;
  const newState = col.getAttribute("data-status") || "";
  const cardId =
    e.dataTransfer.getData("text/plain") || e.dataTransfer.getData("text");
  if (fetchData?.tasks?.[cardId]) {
    fetchData.tasks[cardId].state = newState;
    await postState();
  }
  col.classList.remove("drop-target");
  renderBoard();
  updateAllEmptyMessages();
}

/**
 * Touch start handler for mobile drag functionality.
 * @param {TouchEvent} e
 */
function onTouchStart(e) {
  const card = e.currentTarget;
  const touch = e.touches[0];
  touchDraggedElement = card;
  touchDraggedId = card.getAttribute("data-id") || "";
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  isDragging = false;
}

/**
 * Touch move handler: visualizes drop target on mobile.
 * @param {TouchEvent} e
 */
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
    const touch = e.touches[0];
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
    document.querySelectorAll(".drop-target").forEach((el) => el.classList.remove("drop-target"));
    const column = elementUnderTouch?.closest(".in-progress[data-status]");
    if (column) column.classList.add("drop-target");
  }
}

/**
 * Touch end handler: completes the drag operation on mobile.
 * @async
 * @param {TouchEvent} e
 */
async function onTouchEnd(e) {
  if (!touchDraggedElement || !touchDraggedId) return;
  if (isDragging) {
    const touch = e.changedTouches[0];
    const elementUnderTouch = document.elementFromPoint(
      touch.clientX,
      touch.clientY,
    );
    const targetColumn = elementUnderTouch?.closest(
      ".in-progress[data-status]",
    );
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

/**
 * Binds the search input listener on the board page.
 * @returns {void}
 */
function initSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  input.addEventListener("input", searchBar);
}
