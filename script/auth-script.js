/**
 * Checks the user's authentication status when the page loads.
 * Redirects the client to the homepage if no valid status 
 * (guest or logged in) is found in sessionStorage.  
 * @function
 * @global
 */
window.onload = function () {
  const userStatus = sessionStorage.getItem("userStatus");
  const UID = sessionStorage.getItem("userID");
  if (!userStatus || (userStatus !== "guest" && userStatus !== "loggedIn")) {
    window.location.href = "../html/index.html";
  }
};
