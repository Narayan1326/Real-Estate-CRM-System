const Lead = require('../models/Lead');
const Client = require('../models/Client');

// Get all leads
exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.find()
            .populate('assignedAgent', 'name email')
            .sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leads', error: error.message });
    }
};

// Get single lead
exports.getLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id)
            .populate('assignedAgent', 'name email')
            .populate('convertedTo');

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lead', error: error.message });
    }
};

// Create lead
exports.createLead = async (req, res) => {
    try {
        const lead = new Lead({
            ...req.body,
            assignedAgent: req.user._id
        });

        await lead.save();
        res.status(201).json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Error creating lead', error: error.message });
    }
};

// Update lead
exports.updateLead = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = [
            'name',
            'email',
            'phone',
            'source',
            'status',
            'type',
            'preferences',
            'notes',
            'followUpDate'
        ];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates' });
        }

        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Check if user is the assigned agent or admin
        if (lead.assignedAgent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this lead' });
        }

        updates.forEach(update => lead[update] = req.body[update]);
        await lead.save();

        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lead', error: error.message });
    }
};

// Delete lead
exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Check if user is the assigned agent or admin
        if (lead.assignedAgent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this lead' });
        }

        await lead.remove();
        res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting lead', error: error.message });
    }
};

// Add note to lead
exports.addNote = async (req, res) => {
    try {
        const { content } = req.body;
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Check if user is the assigned agent or admin
        if (lead.assignedAgent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to add notes to this lead' });
        }

        await lead.addNote(content, req.user._id);
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Error adding note', error: error.message });
    }
};

// Convert lead to client
exports.convertToClient = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Check if user is the assigned agent or admin
        if (lead.assignedAgent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to convert this lead' });
        }

        // Create new client from lead
        const client = new Client({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            type: lead.type,
            assignedAgent: lead.assignedAgent,
            preferences: lead.preferences,
            source: lead.source
        });

        await client.save();

        // Update lead status and link to client
        await lead.convertToClient(client._id);

        res.json({ lead, client });
    } catch (error) {
        res.status(500).json({ message: 'Error converting lead', error: error.message });
    }
};

// Get agent's leads
exports.getAgentLeads = async (req, res) => {
    try {
        const leads = await Lead.find({ assignedAgent: req.user._id })
            .sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching agent leads', error: error.message });
    }
};

// Search leads
exports.searchLeads = async (req, res) => {
    try {
        const { name, email, source, status, type } = req.query;
        const query = {};

        if (name) query.name = new RegExp(name, 'i');
        if (email) query.email = new RegExp(email, 'i');
        if (source) query.source = source;
        if (status) query.status = status;
        if (type) query.type = type;

        const leads = await Lead.find(query)
            .populate('assignedAgent', 'name email')
            .sort({ createdAt: -1 });

        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error searching leads', error: error.message });
    }
}; 