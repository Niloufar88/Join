function filterPriority(priority) {
  const prioArray = Array.isArray(priority) ? priority : [priority];
  for (let i = 0; i < prioArray.length; i++) {
    if (prioArray[i] === "urgent") return "urgent";
    if (prioArray[i] === "medium") return "medium";
    if (prioArray[i] === "low") return "low";
  }
  return "";
}

function filterCategory(category) {
  const categoryArray = Array.isArray(category) ? category : [category];
  for (let i = 0; i < categoryArray.length; i++) {
    if (categoryArray[i] === "Technical Task") return "technical-task";
    if (categoryArray[i] === "User Story") return "user-story";
  }
  return "";
}

function updateAllEmptyMessages() {
  const columns = document.querySelectorAll(".in-progress[data-status]");
  columns.forEach((column) => {
    const cardContainer = column.querySelector(".cardsContainer");
    const emptyMessage = column.querySelector(".empty");
    if (!cardContainer || !emptyMessage) return;
    if (cardContainer.children.length === 0) {
      emptyMessage.classList.remove("emptyDisplay");
    } else {
      emptyMessage.classList.add("emptyDisplay");
    }
  });
}

function dateStringChange(taskduedate) {
  const [y, m, d] = taskduedate.split("-");
  return `${d}/${m}/${y}`;
}

function capitalizeLetters(value) {
  return value ? value[0].toUpperCase() + value.slice(1) : "";
}

function capitalizeLettersFullName(contacts) {
  return renderTaskContact(contacts);
}

function getSubtaskStats(task) {
  const subtasks = task.subtasks || [];
  const total = subtasks.length;
  const checked = subtasks.filter((sub) => sub.state === "check").length;
  return { total, checked };
}