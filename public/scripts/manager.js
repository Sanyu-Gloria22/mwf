new Chart(document.getElementById('revenueChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'],
    datasets: [{
      label: 'Revenue (UGX)',
      data: [1200000, 1500000, 1800000, 1400000, 2000000, 2200000, 2500000, 2300000, 2700000],
      borderColor: '#2c3e50',
      backgroundColor: 'rgba(44,62,80,0.1)',
      fill: true,
      tension: 0.4
    }]
  }
});
    // Top Selling Items
new Chart(document.getElementById('topItemsChart').getContext('2d'), {
  type: 'doughnut',
  data: {
    labels: ['Office Desk', 'Chairs', 'Timber', 'Wardrobe'],
    datasets: [{
      data: [45, 30, 15, 10],
      backgroundColor: ['#3498db','#e67e22','#2ecc71','#9b59b6']
    }]
  }
});    

    // Sales Growth
new Chart(document.getElementById('growthChart').getContext('2d'), {
  type: 'bar',
  data: {
    labels: ['2021','2022','2023','2024','2025'],
    datasets: [{
      label: 'Total Sales (UGX)',
      data: [8000000, 12000000, 15000000, 18000000, 21000000],
      backgroundColor: '#27ae60'
    }]
  }
});
