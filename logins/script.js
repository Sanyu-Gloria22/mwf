const form = document.getElementById("login-form");
const errorText = document.getElementById("error");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const emailAddress = document.getElementById("exampleInutEmail1").value;
  const password = document.getElementById("exampleInputPassword1").value;
  const role = document.getElementById("role").value;

  if (role === "admin" && "emailAddress" && "password" ==="n13") {
    window.location.href = "admin.html";
  }

  else {
    errorText.textContent = "Invalid emailAddress or Password";
  }

});