const ctx = document.getElementById('chartbar').getContext('2d');

const chartbar = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Wood', 'Furniture', 'Plywood', 'Chairs', 'Tables'],
    datasets: [{
      label: 'Units Sold',
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ]
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});


const ctx2 = document.getElementById('chartline').getContext('2d');

const chartline = new Chart(ctx2, {
  type: 'line',
  data: {
    labels: ['Wood', 'Furniture', 'Plywood', 'Chairs', 'Tables'],
    datasets: [{
      label: 'Units Sold',
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ]
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});


const ctx3 = document.getElementById('chartpie').getContext('2d');

const chartpie = new Chart(ctx3, {
  type: 'pie',
  data: {
    labels: ['Wood', 'Furniture', 'Plywood', 'Chairs', 'Tables'],
    datasets: [{
      label: 'Units Sold',
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ]
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
