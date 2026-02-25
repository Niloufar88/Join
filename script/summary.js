/**
 * global variables
 */

const toDoNumber = document.getElementById("toDoNumbers");
const doneNumber = document.getElementById("doneNumbers");
const urgentNumber = document.getElementById("urgentNumbers");
const dueDate = document.getElementById("dueDate");
const totalTasksNumber = document.getElementById("totalTasksNumbers");
const inProgressNumber = document.getElementById("inProgressNumber");
const awaitingFeedbackNumber = document.getElementById(
  "awaitingFeedbackNumber",
);

/**
 * functions to load task data from Firebase and provide utility functions for summary page.
 */

const tasks_URL =
  "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/tasks";
let tasksFetchedData = {};

/**
 * an async function to initialize the tasks by fetching data from Firebase and updating the summary page with the relevant task counts and due dates. It calls the getTasksArray function to retrieve the task data, then processes it to count urgent tasks with due dates, and updates the summary item numbers for different task states.
 */
async function initializeTasks() {
  await getTasksArray();
  urgentNumberCountWithDueDate();
  buildSummaryItemNumbers1();
  buildSummaryItemNumbers2();
}

/**
 * an async function to load task data from Firebase, handle errors, and return the fetched data as an object. It also processes the data to ensure it is in the correct format for further use in the application.
 * @returns {Promise<Object>} The fetched task data as an object.
 */

async function loadTaskDataFromFirebase() {
  try {
    const response = await fetch(tasks_URL + ".json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseToJson = await response.json();
    if (responseToJson && typeof responseToJson === "object") {
      tasksFetchedData = {};
      for (const [id, tasksState] of Object.entries(responseToJson)) {
        tasksFetchedData[id] = { id, ...tasksState };
      }
    } else {
      tasksFetchedData = {};
    }
    return tasksFetchedData;
  } catch (error) {
    console.error("Error loading database:", error);
    tasksFetchedData = {};
    return {};
  }
}

/**
 * an async function that retrieves task data from Firebase, processes it to filter out tasks based on their state, and returns an array of task objects.
 * @returns {Promise<Array>} An array of task base on their state.
 */
async function getTasksArray() {
  await loadTaskDataFromFirebase();
  if (!tasksFetchedData || !Object.keys(tasksFetchedData).length) {
    return [];
  }
  const tasks = [];
  Object.entries(tasksFetchedData).forEach(([id, data]) => {
    if (data.state) {
      tasks.push({ id, ...data });
    }
  });
  return tasks;
}

/**
 * a function to extract and count the number of tasks in "to do" and "done" states from the fetched task data, and update the corresponding elements in the DOM to display these counts. It iterates through the task data, checks the state of each task, and increments the respective counters before updating the DOM elements with the final counts.
 */
function buildSummaryItemNumbers1() {
  let toDoCount = 0;
  let doneCount = 0;
  Object.values(tasksFetchedData).forEach((task) => {
    if (task.state === "todu") {
      toDoCount++;
    } else if (task.state === "done") {
      doneCount++;
    }
  });
  toDoNumber.textContent = toDoCount;
  doneNumber.textContent = doneCount;
}

/**
 * a function to extract and count the number of tasks in "in progress" and "awaiting feedback" states from the fetched task data, as well as the total number of tasks. It iterates through the task data, checks the state of each task, and increments the respective counters before updating the DOM elements with the final counts for total tasks, in progress tasks, and awaiting feedback tasks.
 */
function buildSummaryItemNumbers2() {
  let totalTasksCount = 0;
  let inProgressCount = 0;
  let awaitingFeedbackCount = 0;
  Object.values(tasksFetchedData).forEach((task) => {
    if (task.state === "inProgress") {
      inProgressCount++;
    } else if (task.state === "feedBack") {
      awaitingFeedbackCount++;
    }
  });
  totalTasksCount = Object.keys(tasksFetchedData).length;
  totalTasksNumber.textContent = totalTasksCount;
  inProgressNumber.textContent = inProgressCount;
  awaitingFeedbackNumber.textContent = awaitingFeedbackCount;
}

/**
 * a function to count the number of tasks with "urgent" priority and extract their due dates from the fetched task data. It iterates through the task data, checks for tasks with "urgent" priority, increments the urgent count, and collects their due dates. The function then updates the DOM element to display the count of urgent tasks and sets the earliest due date among them if available.
 */
function urgentNumberCountWithDueDate() {
  let urgentCount = 0;
  let dueDates = [];
  Object.values(tasksFetchedData).forEach((task) => {
    if (task.priority === "urgent") {
      urgentCount++;
      if (task.duedate) dueDates.push(task.duedate);
    }
  });
  urgentNumber.textContent = urgentCount;
  if (dueDates.length > 0) {
    dueDates.sort();
    dueDate.textContent = dueDates[0];
  } else {
    dueDate.textContent = "";
  }
}

/**
 * Function to greet signed Users or guests with welcome animation, it checks the screen width and if it is less than or equal to 991px, it triggers the welcome animation by calling the startWelcomeAnimation function.
 */

function greetingGuest() {
  const checkQueries = window.matchMedia("(max-width: 991px)");
  if (checkQueries.matches) {
    startWelcomeAnimation();
  }
}

/**
 * a function to display a welcome animation for users on smaller screens. It hides the summary content, shows a welcome message with the user's name (if available), and then after a short delay, it hides the welcome message and displays the summary content again. The animation is triggered by adding and removing a CSS class that defines the animation effects.
 */
function startWelcomeAnimation() {
  const summaryDiv = document.querySelector(".summary-div");
  const welcomePage = document.querySelector(".welcome-page");
  const welcomeMsg = document.querySelector(".welcomeMsg");
  const signedUser = document.getElementById("signedUser");
  summaryDiv.style.display = "none";
  welcomePage.classList.add("welcome-animation");
  welcomeMsg.textContent = `Good morning!`;
  signedUser.textContent = userName === "Guest" ? "" : `${userName}`;
  welcomePage.style.display = "flex";
  setTimeout(() => {
    welcomePage.classList.remove("welcome-animation");
    welcomePage.style.display = "none";
    summaryDiv.style.display = "block";
  }, 3000);
}

/**
 * Function to make overview boxes clickable and redirect to board.html
 */

const boxItems = document.querySelectorAll(".overview-box-items");
boxItems.forEach((box) => {
  box.addEventListener("click", () => {
    window.location.href = "../html/board.html";
  });
});
