document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const filterBy = document.getElementById("filterBy");
  const sortBy = document.getElementById("sortBy");
  const tableBody = document.getElementById("stockTable");

  const getRows = () => Array.from(tableBody.querySelectorAll("tr"));

  // SEARCH FUNCTION
  searchInput.addEventListener("keyup", () => {
    const query = searchInput.value.toLowerCase();
    getRows().forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
    });
  });

  // FILTER FUNCTION
  filterBy.addEventListener("change", () => {
    const filter = filterBy.value;
    if (!filter) {
      getRows().forEach(row => (row.style.display = ""));
      return;
    }

    const query = searchInput.value.toLowerCase();
    getRows().forEach(row => {
      const cellValue = row.querySelector(
        `td:nth-child(${filter === "productType" ? 1 : 10})`
      )?.textContent.toLowerCase() || "";
      row.style.display = cellValue.includes(query) ? "" : "none";
    });
  });

  // SORT FUNCTION
  sortBy.addEventListener("change", () => {
    const sortValue = sortBy.value;
    const rows = getRows();
    if (!sortValue) return;

    rows.sort((a, b) => {
      if (sortValue === "quantity") {
        const qA = parseFloat(a.children[2].textContent) || 0;
        const qB = parseFloat(b.children[2].textContent) || 0;
        return qA - qB;
      }
      if (sortValue === "date") {
        const dA = new Date(a.children[8].textContent.split("-").reverse().join("-"));
        const dB = new Date(b.children[8].textContent.split("-").reverse().join("-"));
        return dA - dB;
      }
    });

    rows.forEach(row => tableBody.appendChild(row)); // Reorder rows
  });
});
