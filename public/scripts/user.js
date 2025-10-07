function searchUsers() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toLowerCase();
  const table = document.getElementById("usersTable");
  const tr = table.getElementsByTagName("tr");

  // Loop through all table rows (except the header)
  for (let i = 1; i < tr.length; i++) {
    const tds = tr[i].getElementsByTagName("td");
    let rowContainsFilter = false;

    // Loop through all table cells in this row
    for (let j = 0; j < tds.length - 1; j++) { // skip last column (Update button)
      if (tds[j]) {
        const cellText = tds[j].textContent || tds[j].innerText;
        if (cellText.toLowerCase().indexOf(filter) > -1) {
          rowContainsFilter = true;
          break;
        }
      }
    }

    tr[i].style.display = rowContainsFilter ? "" : "none";
  }
}
