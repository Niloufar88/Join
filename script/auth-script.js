/**
 * Überprüft beim Laden der Seite den Authentifizierungsstatus des Benutzers.
 * Leitet den Client zur Startseite weiter, wenn kein gültiger Status 
 * (Gast oder angemeldet) in der sessionStorage gefunden wird.
 * * @function
 * @global
 */
window.onload = function () {
  const userStatus = sessionStorage.getItem("userStatus");
  const UID = sessionStorage.getItem("userID");
  if (!userStatus || (userStatus !== "guest" && userStatus !== "loggedIn")) {
    window.location.href = "../html/index.html";
  }
};
