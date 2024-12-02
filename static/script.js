let services = [];

// Theme handling
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function updateTable(filterText = '') {
    const tbody = document.getElementById('services-table');
    tbody.innerHTML = '';
    
    const filteredServices = filterText 
        ? services.filter(service => 
            service.name.toLowerCase().includes(filterText.toLowerCase()) || 
            service.display_name.toLowerCase().includes(filterText.toLowerCase()))
        : services;
    
    filteredServices.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.name}</td>
            <td>${service.display_name}</td>
            <td>${service.status}</td>
            <td>${service.start_type}</td>
        `;
        tbody.appendChild(row);
    });
}

function fetchServices() {
    fetch('/api/services')
        .then(response => response.json())
        .then(data => {
            services = data;
            const searchInput = document.getElementById('search-input');
            updateTable(searchInput.value);
        })
        .catch(error => console.error('Error:', error));
}

// Initialize theme from localStorage or default to light
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    fetchServices();
});

// Refresh button click handler
document.getElementById('refresh-btn').addEventListener('click', fetchServices);

// Search input handler
document.getElementById('search-input').addEventListener('input', (e) => {
    updateTable(e.target.value);
    // Reset quick filters dropdown when typing
    document.getElementById('quick-filters').value = '';
});

// Quick filters handler
document.getElementById('quick-filters').addEventListener('change', (e) => {
    const filterValue = e.target.value;
    document.getElementById('search-input').value = filterValue;
    updateTable(filterValue);
});

// Theme toggle button handler
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
