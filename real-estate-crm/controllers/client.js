const Client = require('../models/Client');

// Get all clients
exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find()
            .populate('assignedAgent', 'name email')
            .sort({ createdAt: -1 });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clients', error: error.message });
    }
};

// Get single client
exports.getClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id)
            .populate('assignedAgent', 'name email')
            .populate('properties');

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching client', error: error.message });
    }
};

// Create client
exports.createClient = async (req, res) => {
    try {
        const client = new Client({
            ...req.body,
            assignedAgent: req.user._id
        });

        await client.save();
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error creating client', error: error.message });
    }
};

// Update client
exports.updateClient = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = [
            'name',
            'email',
            'phone',
            'type',
            'status',
            'preferences',
            'notes',
            'documents'
        ];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates' });
        }

        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Check if user is the assigned agent or admin
        if (client.assignedAgent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this client' });
        }

        updates.forEach(update => client[update] = req.body[update]);
        await client.save();

        res.json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error updating client', error: error.message });
    }
};

// Delete client
exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Check if user is the assigned agent or admin
        if (client.assignedAgent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this client' });
        }

        await client.remove();
        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting client', error: error.message });
    }
};

// Add note to client
exports.addNote = async (req, res) => {
    try {
        const { content } = req.body;
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Check if user is the assigned agent or admin
        if (client.assignedAgent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to add notes to this client' });
        }

        await client.addNote(content, req.user._id);
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error adding note', error: error.message });
    }
};

// Add document to client
exports.addDocument = async (req, res) => {
    try {
        const { name, url, type } = req.body;
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Check if user is the assigned agent or admin
        if (client.assignedAgent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to add documents to this client' });
        }

        await client.addDocument(name, url, type);
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error adding document', error: error.message });
    }
};

// Get agent's clients
exports.getAgentClients = async (req, res) => {
    try {
        const clients = await Client.find({ assignedAgent: req.user._id })
            .sort({ createdAt: -1 });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching agent clients', error: error.message });
    }
};

// Search clients
exports.searchClients = async (req, res) => {
    try {
        const { name, email, type, status } = req.query;
        const query = {};

        if (name) query.name = new RegExp(name, 'i');
        if (email) query.email = new RegExp(email, 'i');
        if (type) query.type = type;
        if (status) query.status = status;

        const clients = await Client.find(query)
            .populate('assignedAgent', 'name email')
            .sort({ createdAt: -1 });

        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error searching clients', error: error.message });
    }
}; 