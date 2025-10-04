const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("error-msg");

// Login form submit
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailAddress: email, password }),
  });

  if (res.redirected) {
    window.location.href = res.url;
  } else {
    errorMsg.style.display = "block";
    errorMsg.textContent = "Invalid email or password. Try again!";
  }
});

// Password toggle
const togglePassword = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");
const toggleIcon = document.getElementById("toggleIcon");

togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
});
