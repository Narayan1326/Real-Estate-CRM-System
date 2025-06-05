// Authentication and Authorization utilities

// Check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Get authentication token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Set authentication token
function setAuthToken(token) {
    localStorage.setItem('token', token);
}

// Remove authentication token
function removeAuthToken() {
    localStorage.removeItem('token');
}

// Add authentication header to fetch requests
function addAuthHeader(headers = {}) {
    const token = getAuthToken();
    if (token) {
        return {
            ...headers,
            'Authorization': `Bearer ${token}`
        };
    }
    return headers;
}

// Handle authentication errors
function handleAuthError(error) {
    if (error.status === 401) {
        removeAuthToken();
        window.location.href = '/';
    }
    throw error;
}

// Logout user
function logout() {
    removeAuthToken();
    window.location.href = '/';
}

// Register new user
async function register(userData) {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (response.ok) {
            setAuthToken(data.token);
            return data.user;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        throw new Error('Registration failed: ' + error.message);
    }
}

// Login user
async function login(credentials) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        if (response.ok) {
            setAuthToken(data.token);
            return data.user;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        throw new Error('Login failed: ' + error.message);
    }
}

// Get current user profile
async function getCurrentUser() {
    try {
        const response = await fetch('/api/auth/me', {
            headers: addAuthHeader()
        });

        const data = await response.json();
        if (response.ok) {
            return data.user;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        handleAuthError(error);
    }
}

// Update user profile
async function updateProfile(userData) {
    try {
        const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: addAuthHeader({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (response.ok) {
            return data.user;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        handleAuthError(error);
    }
}

// Change password
async function changePassword(passwordData) {
    try {
        const response = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: addAuthHeader({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(passwordData)
        });

        const data = await response.json();
        if (response.ok) {
            return true;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        handleAuthError(error);
    }
}

// Export functions
window.auth = {
    isAuthenticated,
    getAuthToken,
    setAuthToken,
    removeAuthToken,
    addAuthHeader,
    handleAuthError,
    logout,
    register,
    login,
    getCurrentUser,
    updateProfile,
    changePassword
}; 