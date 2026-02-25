/**
 * Persists the current `fetchData` state to the backend using PATCH.
 * @async
 * @returns {Promise<any>}
 * @throws {Error} If the HTTP response is not OK.
 */
async function postState() {
  const response = await fetch(`${BASE_URL}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fetchData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

/**
 * Initialisiert die Add-Task-Ansicht: lädt benötigte Daten und registriert Event-Handler.
 * @async
 * @returns {Promise<void>}
 */
async function addTaskinit() {
  await getData();
}