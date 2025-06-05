const express = require('express');
const router = express.Router();
const { auth, isAgentOrAdmin } = require('../middleware/auth');
const {
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    addNote,
    addDocument,
    getAgentClients,
    searchClients
} = require('../controllers/client');

// Protected routes
router.get('/', auth, getClients);
router.get('/search', auth, searchClients);
router.get('/agent', auth, isAgentOrAdmin, getAgentClients);
router.get('/:id', auth, getClient);
router.post('/', auth, isAgentOrAdmin, createClient);
router.put('/:id', auth, isAgentOrAdmin, updateClient);
router.delete('/:id', auth, isAgentOrAdmin, deleteClient);
router.post('/:id/notes', auth, isAgentOrAdmin, addNote);
router.post('/:id/documents', auth, isAgentOrAdmin, addDocument);

module.exports = router; 