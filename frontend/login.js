// login.js
import { auth } from "../firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordWrapper = document.getElementById("confirmPasswordWrapper");
const confirmPasswordInput = document.getElementById("confirmPassword");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const toggleForm = document.getElementById("toggleForm");
const message = document.getElementById("message");

// Toggle password visibility
window.togglePassword = function (id, el) {
  const input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
    el.textContent = "🙈";
  } else {
    input.type = "password";
    el.textContent = "👁";
  }
};

// Show signup form
function showSignup() {
  confirmPasswordWrapper.style.display = "flex";
  signupBtn.style.display = "inline-block";
  loginBtn.style.display = "none";
  toggleForm.innerHTML = 'Already have an account? <a href="#">Login</a>';
}

// Show login form
function showLogin() {
  confirmPasswordWrapper.style.display = "none";
  signupBtn.style.display = "none";
  loginBtn.style.display = "inline-block";
  toggleForm.innerHTML = 'Don\'t have an account? <a href="#">Sign Up</a>';
}

// Toggle form event

toggleForm.addEventListener("click", (e) => {
  e.preventDefault();
  if (loginBtn.style.display !== "none") {
    showSignup();
  } else {
    showLogin();
  }
  message.textContent = "";
});

// Login event
loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) {
    message.textContent = "Please enter email and password.";
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
    message.textContent = "Login successful! Redirecting...";
    window.location.href = "home.html";
  } catch (err) {
    message.textContent = err.message.replace("Firebase:", "");
  }
});

// Signup event
signupBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  if (!email || !password || !confirmPassword) {
    message.textContent = "Please fill all fields.";
    return;
  }
  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    message.textContent = "Signup successful! Redirecting...";
    window.location.href = "home.html";
  } catch (err) {
    message.textContent = err.message.replace("Firebase:", "");
  }
});

// Default to login form
showLogin();
