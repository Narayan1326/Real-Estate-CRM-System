// DOM Elements
const modal = document.getElementById('modal');
const modalClose = document.querySelector('.close');
const content = document.getElementById('content');
const navLinks = document.querySelectorAll('.nav-links a');

// State Management
let currentUser = null;
let properties = [];
let clients = [];
let leads = [];

// API Endpoints
const API = {
    properties: '/api/properties',
    clients: '/api/clients',
    leads: '/api/leads',
    auth: '/api/auth'
};

// Event Listeners
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = e.target.closest('a').getAttribute('href').slice(1);
        navigateTo(route);
        updateActiveLink(e.target.closest('a'));
    });
});

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Navigation
function navigateTo(route) {
    switch(route) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'properties':
            loadProperties();
            break;
        case 'clients':
            loadClients();
            break;
        case 'leads':
            loadLeads();
            break;
        case 'calendar':
            loadCalendar();
            break;
        case 'reports':
            loadReports();
            break;
        default:
            loadDashboard();
    }
}

function updateActiveLink(clickedLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    clickedLink.classList.add('active');
}

// API Calls
async function fetchData(endpoint) {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

async function postData(endpoint, data) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error posting data:', error);
        return null;
    }
}

// Page Loaders
async function loadDashboard() {
    const stats = await fetchData(API.properties + '/stats');
    const recentLeads = await fetchData(API.leads + '/recent');
    
    content.innerHTML = `
        <div class="dashboard-grid">
            <div class="card">
                <h3>Active Listings</h3>
                <p class="number">${stats?.activeListings || 0}</p>
            </div>
            <div class="card">
                <h3>New Leads</h3>
                <p class="number">${stats?.newLeads || 0}</p>
            </div>
            <div class="card">
                <h3>Appointments</h3>
                <p class="number">${stats?.appointments || 0}</p>
            </div>
            <div class="card">
                <h3>Revenue</h3>
                <p class="number">$${stats?.revenue?.toLocaleString() || 0}</p>
            </div>
        </div>
        <div class="recent-leads">
            <h2>Recent Leads</h2>
            ${generateLeadsTable(recentLeads)}
        </div>
    `;
}

function generateLeadsTable(leads) {
    if (!leads || leads.length === 0) {
        return '<p>No recent leads</p>';
    }

    return `
        <table class="leads-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Interest</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${leads.map(lead => `
                    <tr>
                        <td>${lead.name}</td>
                        <td>${lead.email}</td>
                        <td>${lead.phone}</td>
                        <td>${lead.interest}</td>
                        <td>${lead.status}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function loadProperties() {
    const properties = await fetchData(API.properties);
    content.innerHTML = `
        <div class="properties-header">
            <h2>Properties</h2>
            <button onclick="showAddPropertyModal()" class="btn-primary">Add Property</button>
        </div>
        <div class="properties-grid">
            ${properties?.map(property => `
                <div class="property-card">
                    <img src="${property.images[0]}" alt="${property.title}">
                    <div class="property-info">
                        <h3>${property.title}</h3>
                        <p class="price">$${property.price.toLocaleString()}</p>
                        <p>${property.location}</p>
                        <div class="property-stats">
                            <span>${property.bedrooms} beds</span>
                            <span>${property.bathrooms} baths</span>
                            <span>${property.sqft} sqft</span>
                        </div>
                    </div>
                </div>
            `).join('') || 'No properties found'}
        </div>
    `;
}

// Modal Functions
function showAddPropertyModal() {
    modal.style.display = 'block';
    modal.querySelector('#modal-body').innerHTML = `
        <h2>Add New Property</h2>
        <form id="add-property-form">
            <div class="form-group">
                <label>Title</label>
                <input type="text" name="title" required>
            </div>
            <div class="form-group">
                <label>Price</label>
                <input type="number" name="price" required>
            </div>
            <div class="form-group">
                <label>Location</label>
                <input type="text" name="location" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" required></textarea>
            </div>
            <button type="submit" class="btn-primary">Add Property</button>
        </form>
    `;

    document.getElementById('add-property-form').addEventListener('submit', handleAddProperty);
}

async function handleAddProperty(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const propertyData = Object.fromEntries(formData.entries());
    
    const result = await postData(API.properties, propertyData);
    if (result) {
        modal.style.display = 'none';
        loadProperties();
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initApp();
});

// Global state
const state = {
    currentPage: 'dashboard',
    user: null,
    properties: [],
    clients: [],
    leads: []
};

// Initialize the application
function initApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Load initial page
    loadPage('dashboard');
}

// Set up event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            loadPage(page);
        });
    });

    // Login button
    document.getElementById('loginBtn').addEventListener('click', () => {
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    });

    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

// Load page content
async function loadPage(page) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '<div class="text-center"><div class="spinner"></div></div>';

    try {
        switch (page) {
            case 'dashboard':
                await loadDashboard();
                break;
            case 'properties':
                await loadProperties();
                break;
            case 'clients':
                await loadClients();
                break;
            case 'leads':
                await loadLeads();
                break;
            default:
                mainContent.innerHTML = '<div class="alert alert-danger">Page not found</div>';
        }
        state.currentPage = page;
    } catch (error) {
        mainContent.innerHTML = `<div class="alert alert-danger">Error loading page: ${error.message}</div>`;
    }
}

// Load dashboard content
async function loadDashboard() {
    const mainContent = document.getElementById('mainContent');
    const response = await fetch('/api/dashboard');
    const data = await response.json();

    mainContent.innerHTML = `
        <div class="row">
            <div class="col-md-3">
                <div class="stat-card">
                    <h3>Active Listings</h3>
                    <p class="number">${data.activeListings}</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <h3>New Leads</h3>
                    <p class="number">${data.newLeads}</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <h3>Appointments</h3>
                    <p class="number">${data.appointments}</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <h3>Revenue</h3>
                    <p class="number">$${data.revenue.toLocaleString()}</p>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5>Recent Properties</h5>
                    </div>
                    <div class="card-body">
                        ${renderRecentProperties(data.recentProperties)}
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5>Recent Leads</h5>
                    </div>
                    <div class="card-body">
                        ${renderRecentLeads(data.recentLeads)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load properties content
async function loadProperties() {
    const mainContent = document.getElementById('mainContent');
    const response = await fetch('/api/properties');
    const properties = await response.json();

    mainContent.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Properties</h2>
            <button class="btn btn-primary" onclick="showAddPropertyModal()">
                <i class="fas fa-plus"></i> Add Property
            </button>
        </div>
        <div class="row">
            ${properties.map(property => renderPropertyCard(property)).join('')}
        </div>
    `;
}

// Load clients content
async function loadClients() {
    const mainContent = document.getElementById('mainContent');
    const response = await fetch('/api/clients');
    const clients = await response.json();

    mainContent.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Clients</h2>
            <button class="btn btn-primary" onclick="showAddClientModal()">
                <i class="fas fa-plus"></i> Add Client
            </button>
        </div>
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${clients.map(client => renderClientRow(client)).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Load leads content
async function loadLeads() {
    const mainContent = document.getElementById('mainContent');
    const response = await fetch('/api/leads');
    const leads = await response.json();

    mainContent.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Leads</h2>
            <button class="btn btn-primary" onclick="showAddLeadModal()">
                <i class="fas fa-plus"></i> Add Lead
            </button>
        </div>
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Source</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${leads.map(lead => renderLeadRow(lead)).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Helper functions for rendering components
function renderPropertyCard(property) {
    return `
        <div class="col-md-4 mb-4">
            <div class="card property-card">
                <img src="${property.image || 'img/placeholder.jpg'}" class="card-img-top" alt="${property.title}">
                <div class="card-body">
                    <h5 class="card-title">${property.title}</h5>
                    <p class="price">$${property.price.toLocaleString()}</p>
                    <p class="card-text">${property.description}</p>
                    <div class="d-flex justify-content-between">
                        <span><i class="fas fa-bed"></i> ${property.bedrooms}</span>
                        <span><i class="fas fa-bath"></i> ${property.bathrooms}</span>
                        <span><i class="fas fa-ruler-combined"></i> ${property.sqft} sqft</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderClientRow(client) {
    return `
        <tr>
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td><span class="badge bg-${getStatusBadgeColor(client.status)}">${client.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editClient(${client.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteClient(${client.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

function renderLeadRow(lead) {
    return `
        <tr>
            <td>${lead.name}</td>
            <td>${lead.source}</td>
            <td><span class="badge bg-${getStatusBadgeColor(lead.status)}">${lead.status}</span></td>
            <td>${new Date(lead.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editLead(${lead.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteLead(${lead.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

function getStatusBadgeColor(status) {
    const colors = {
        'active': 'success',
        'pending': 'warning',
        'inactive': 'danger',
        'new': 'info'
    };
    return colors[status.toLowerCase()] || 'secondary';
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            state.user = data.user;
            localStorage.setItem('token', data.token);
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            loadPage(state.currentPage);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
} 