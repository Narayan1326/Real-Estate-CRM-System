const express = require('express');
const router = express.Router();
const { auth, isAgentOrAdmin } = require('../middleware/auth');
const {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    searchProperties,
    getAgentProperties,
    toggleFavorite
} = require('../controllers/property');

// Public routes
router.get('/', getProperties);
router.get('/search', searchProperties);
router.get('/:id', getProperty);

// Protected routes
router.post('/', auth, isAgentOrAdmin, createProperty);
router.put('/:id', auth, isAgentOrAdmin, updateProperty);
router.delete('/:id', auth, isAgentOrAdmin, deleteProperty);
router.get('/agent/properties', auth, isAgentOrAdmin, getAgentProperties);
router.post('/:id/favorite', auth, toggleFavorite);

module.exports = router; 