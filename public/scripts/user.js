const users = []; // Empty or stub - real users come from backend API

const userTableBody = document.querySelector("#userTable tbody");

function renderTable(userList) {
  userTableBody.innerHTML = "";

  userList.forEach(user => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><img src="${user.photo}" alt="${user.name}" class="profile-img"></td>
      <td>${user.name}</td>
      <td>${user.salary}</td>
      <td>${user.age}</td>
      <td>
        <button class="action-btn btn-view" onclick="alert('View user: ${user.name}')">&#x1F50D;</button>
        <button class="action-btn btn-edit" onclick="alert('Edit user: ${user.name}')" disabled>&#9998;</button>
        <button class="action-btn btn-delete" onclick="alert('Delete user: ${user.name}')" disabled>&#128465;</button>
      </td>
    `;

    userTableBody.appendChild(tr);
  });
}

function searchUsers() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = users.filter(user => user.name.toLowerCase().includes(query));
  renderTable(filtered);
}

// Placeholder for add new - real add new triggers backend
function addNewUser() {
  alert("Add new user triggers backend functionality");
}

// Example: fetch users from backend and render (to be implemented)
async function loadUsersFromBackend() {
  // Fetch users from backend API here
  // const response = await fetch('/api/users');
  // const data = await response.json();
  // users = data; // Update users array
  // renderTable(users);
}

// Initial call to load users and render
// loadUsersFromBackend();