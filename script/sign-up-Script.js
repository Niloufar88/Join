const submitBtn = document.getElementById("submit_button");
const policyCheckbox = document.getElementById("privacy");
const inputFields = document.querySelectorAll(".input-icon input");
const signupForm = document.getElementById("signupForm");
const checkboxAcceptance = document.getElementById("signupCheckedMsg");
const eyeOpen = `<i class="fa-regular fa-eye"></i>`;
const eyeClosed = `<i class="fa-regular fa-eye-slash"></i>`;
const lockIcon = `<i class="fa-solid fa-lock"></i>`;
const passwordInput = document.getElementById("signup-password");
const passwordConfirm = document.getElementById("signup-confirm-password");
const iconPasswordDivMain = document.getElementById(
  "icon_password_switch_main",
);
const iconPasswordDivConfirm = document.getElementById(
  "icon_password_switch_confirm",
);

/**
 * This event listener prevents the default form submission behavior, which would cause a page reload. Instead, it allows  to handle the form submission with JavaScript, enabling us to perform validation and send the data to the server without refreshing the page.
 */
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  signupRegistrationInFirebase();
});
/**
 * the register button is disabled on page load by default until the user accepts the privacy policy by checking the checkbox.
 */
submitBtn.disabled = !policyCheckbox.checked;

/**
 * Enable or disable the submit button based on the checkbox state and form validation.
 * Button is only enabled when checkbox is checked AND all fields are valid.
 */
policyCheckbox.addEventListener("change", async () => {
  if (policyCheckbox.checked) {
    const isValid = await signupValidation();
    if (isValid) {
      submitBtn.disabled = false;
      checkboxAcceptance.style.visibility = "hidden";
    } else {
      policyCheckbox.checked = false;
      submitBtn.disabled = true;
      checkboxAcceptance.style.visibility = "visible";
      checkboxAcceptance.textContent = "the form must be validated first.";
    }
  } else {
    submitBtn.disabled = true;
    checkboxAcceptance.style.visibility = "visible";
    checkboxAcceptance.textContent = "privacy policy must be accepted.";
  }
});

/**
 * Input field focus and blur event handlers to manage the "active" class, which gives users visual feedback, when they interact with the input fields.
 */

inputFields.forEach((input) => {
  const inputContainer = input.parentElement;
  input.addEventListener("focus", () => {
    inputContainer.classList.add("active");
  });
  input.addEventListener("blur", () => {
    if (input.value.trim() !== "") {
      inputContainer.classList.add("active");
    } else {
      inputContainer.classList.remove("active");
    }
  });
});

/**
 * Toggles password visibility between hidden (type="password") and visible (type="text")
 * If type is "password" → reveal the password and show open-eye icon.
 * If type is "text" → hide the password and show closed-eye icon.
 * @param {HTMLInputElement} input - The password input field
 * @param {HTMLElement} iconDiv - The icon container element
 */

function togglePassword(input, iconDiv) {
  if (!input || !input.value.trim()) return;
  if (input.type === "password") {
    input.type = "text";
    if (iconDiv.innerHTML !== eyeOpen) {
      iconDiv.innerHTML = eyeOpen;
    }
  } else {
    input.type = "password";
    if (iconDiv.innerHTML !== eyeClosed) {
      iconDiv.innerHTML = eyeClosed;
    }
  }
}

/**
 * This function runs every time the input value changes.
 * If the input is empty → show the lock icon.
 * If the input has text → show the closed-eye icon (password hidden)
  and make the icon clickable (to toggle password visibility).
 * @param {HTMLInputElement} input - The password input field
 * @param {HTMLElement} iconDiv - The icon container element
 */

function UpdateIcon(input, iconDiv) {
  const value = input.value.trim();
  if (value.length > 0) {
    const newIcon = input.type === "password" ? eyeClosed : eyeOpen;
    if (iconDiv.innerHTML !== newIcon) {
      iconDiv.innerHTML = newIcon;
    }
    iconDiv.onclick = () => togglePassword(input, iconDiv);
    iconDiv.classList.add("eye_switch");
  } else {
    iconDiv.innerHTML = lockIcon;
    iconDiv.onclick = null;
    iconDiv.classList.remove("eye_switch");
    input.type = "password";
  }
}

/**
 * These listeners trigger whenever the user types something
 * in the password or confirm password fields.
 * When text is entered, the lock icon switches to an eye icon.
 */

passwordInput.addEventListener("input", () => {
  UpdateIcon(passwordInput, iconPasswordDivMain);
  passwordInput.addEventListener("blur", () => {
    passwordInput.parentElement.classList.remove("active");
  });
});

passwordConfirm.addEventListener("input", () => {
  UpdateIcon(passwordConfirm, iconPasswordDivConfirm);
  passwordConfirm.addEventListener("blur", () => {
    passwordConfirm.parentElement.classList.remove("active");
  });
});


function goBackToLogin() {
  window.location.href = "../html/index.html";
}
