const express = require('express');
const router = express.Router();
const { auth, isAgentOrAdmin } = require('../middleware/auth');
const {
    getLeads,
    getLead,
    createLead,
    updateLead,
    deleteLead,
    addNote,
    convertToClient,
    getAgentLeads,
    searchLeads
} = require('../controllers/lead');

// Protected routes
router.get('/', auth, getLeads);
router.get('/search', auth, searchLeads);
router.get('/agent', auth, isAgentOrAdmin, getAgentLeads);
router.get('/:id', auth, getLead);
router.post('/', auth, isAgentOrAdmin, createLead);
router.put('/:id', auth, isAgentOrAdmin, updateLead);
router.delete('/:id', auth, isAgentOrAdmin, deleteLead);
router.post('/:id/notes', auth, isAgentOrAdmin, addNote);
router.post('/:id/convert', auth, isAgentOrAdmin, convertToClient);

module.exports = router; 