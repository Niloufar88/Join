/**
 * Reads an input/textarea value by id.
 * @param {string} id
 * @returns {string}
 */
function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

/**
 * Reads the checked radio value of a group.
 * @param {string} name
 * @param {string} fallback
 * @returns {string}
 */
function getCheckedValue(name, fallback = "") {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : fallback;
}