const errorMsg = document.querySelector(".error-msg");

/**
 * Function to toggle password visibility and update the icon accordingly
 * Called on click of the toggle password icon in index.html
 */
function togglePassword() {
  let p = document.getElementById("password");
  let img = document.getElementById("togglePasswordIcon").querySelector("img");
  if (p.type === "password") {
    p.type = "text";
    img.src = "../assets/img/visibility.svg";
  } else {
    p.type = "password";
    img.src = p.value
      ? "../assets/img/visibility_off.svg"
      : "../assets/img/lock.svg";
  }
}

/**
 * Function to update the toggle password icon based on the input value
 * Called on input event of the password field in index.html
 */
function updateIcon() {
  let p = document.getElementById("password");
  let img = document.getElementById("togglePasswordIcon").querySelector("img");

  if (p.type === "password") {
    img.src = p.value
      ? "../assets/img/visibility_off.svg"
      : "../assets/img/lock.svg";
  }
}

/**
 *  function to show the logo animation on page load
 *  Called on window load event in index.html
 */
async function loadImageSequence() {
  const container = document.getElementById("image-sequence");
  container.innerHTML = '<img src="../assets/img/Capa 2.svg" alt="Logo Intro">';
  container.style.display = "block";
  container.classList.add("animate-logo");
  setTimeout(() => {
    container.style.display = "none";
    document.querySelector(".logo").style.visibility = "visible";
  }, 1500);
}

window.addEventListener("load", loadImageSequence);

// sign Up Button Function

function goToSignUp() {
  window.location.href = "../html/sign-up.html";
}

/**
 * a function which checks all the password validation functions for the password input field. If any of the validation functions return false, it shows an error message and highlights the password input field in red.
 * @returns {boolean} Returns true if all password validations pass, false otherwise.
 */
function valildatePassword() {
  const passwordErrorMsg = document.getElementById("passwordErrorMsg");
  const passwordInput = document.getElementById("password");
  passwordErrorMsg.style.visibility = "hidden";
  passwordInput.classList.remove("error");
  if (!loginPasswordNullValidation()) return false;
  if (!loginPasswordSpaceValidation()) return false;
  if (!loginPasswordLenghtValidation()) return false;
  passwordErrorMsg.style.visibility = "hidden";
  passwordInput.classList.remove("error");
  passwordInput.parentElement.style.borderColor = "#ccc";
  return true;
}

/**
 * a function which checks the password input for empty value.If it is, it shows an error message and highlights the password input field in red.
 * @returns {boolean} Returns true if the  password is not empty, false otherwise.
 */
function loginPasswordNullValidation() {
  const password = document.getElementById("password").value;
  const passwordErrorMsg = document.getElementById("passwordErrorMsg");
  const passwordInput = document.getElementById("password");
  passwordErrorMsg.style.visibility = "hidden";
  passwordInput.classList.remove("error");
  if (!password || !password.trim()) {
    passwordErrorMsg.style.visibility = "visible";
    passwordErrorMsg.textContent = "password cannot be empty.";
    passwordInput.classList.add("error");
    return false;
  }
  return true;
}

/**
 * a function which checks the password input for spaces. If it contains spaces, it shows an error message and highlights the password input field in red.
 * @returns {boolean} Returns true if the password does not contain spaces, false otherwise.
 */
function loginPasswordSpaceValidation() {
  const password = document.getElementById("password").value;
  const passwordErrorMsg = document.getElementById("passwordErrorMsg");
  const passwordInput = document.getElementById("password");
  passwordErrorMsg.style.visibility = "hidden";
  passwordInput.classList.remove("error");
  if (/\s/.test(password)) {
    passwordErrorMsg.style.visibility = "visible";
    passwordErrorMsg.textContent = "Password cannot contain spaces.";
    passwordInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    passwordInput.classList.add("error");
    return false;
  }
  return true;
}

/**
 * a function which checks the password input for minimum length of 6 characters. If it is shorter, it shows an error message and highlights the password input field in red.
 * @returns {boolean} Returns true if the password is at least 6 characters long, false otherwise.
 */
function loginPasswordLenghtValidation() {
  const password = document.getElementById("password").value;
  const passwordErrorMsg = document.getElementById("passwordErrorMsg");
  const passwordInput = document.getElementById("password");
  passwordErrorMsg.style.visibility = "hidden";
  passwordInput.classList.remove("error");
  if (password.length < 6) {
    passwordErrorMsg.style.visibility = "visible";
    passwordErrorMsg.textContent =
      "Password must be at least 6 characters long.";
    passwordInput.parentElement.style.borderColor = "rgb(170, 22, 22)";
    passwordInput.classList.add("error");
    return false;
  }
  return true;
}

/**
 * a function which checks all the email validation functions for the email input field. If any of the validation functions return false, it shows an error message and highlights the email input field in red.
 * @returns {boolean} Returns true if all email validations pass, false otherwise.
 */
function validateEmail() {
  const email = document.getElementById("email").value.trim();
  const emailErrorMsg = document.getElementById("emailErrorMsg");
  const emailInput = document.getElementById("email");
  if (!loginEmailNullValidation()) return false;
  if (!loginEmailPatternValidation()) return false;
  else {
    emailErrorMsg.style.visibility = "hidden";
    emailInput.classList.remove("error");
    return true;
  }
}

/**
 * a function which checks the email input for empty value. If it is, it shows an error message and highlights the email input field in red.
 * @returns {boolean} Returns true if the email is not empty, false otherwise.
 */
function loginEmailNullValidation() {
  const email = document.getElementById("email").value.trim();
  const emailErrorMsg = document.getElementById("emailErrorMsg");
  const emailInput = document.getElementById("email");
  if (!email) {
    emailErrorMsg.style.visibility = "visible";
    emailErrorMsg.textContent = "email cannot be empty.";
    emailInput.classList.add("error");
    return false;
  }
  return true;
}

/**
 * a funtion which checks the email input for valid email format. If it is not valid, it shows an error message and highlights the email input field in red.
 * @returns {boolean} Returns true if the email is valid, false otherwise.
 */
function loginEmailPatternValidation() {
  const email = document.getElementById("email").value.trim();
  const emailErrorMsg = document.getElementById("emailErrorMsg");
  const emailInput = document.getElementById("email");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    emailErrorMsg.style.visibility = "visible";
    emailErrorMsg.textContent = "Please enter a valid email address.";
    emailInput.classList.add("error");
    return false;
  }
  return true;
}
