function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function getCheckedValue(name, fallback = "") {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : fallback;
}