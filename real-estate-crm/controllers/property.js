const Property = require('../models/Property');

// Get all properties
exports.getProperties = async (req, res) => {
    try {
        const properties = await Property.find()
            .populate('agent', 'name email')
            .sort({ createdAt: -1 });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching properties', error: error.message });
    }
};

// Get single property
exports.getProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('agent', 'name email');
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Increment views
        await property.incrementViews();

        res.json(property);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching property', error: error.message });
    }
};

// Create property
exports.createProperty = async (req, res) => {
    try {
        const property = new Property({
            ...req.body,
            agent: req.user._id
        });

        await property.save();
        res.status(201).json(property);
    } catch (error) {
        res.status(500).json({ message: 'Error creating property', error: error.message });
    }
};

// Update property
exports.updateProperty = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = [
            'title',
            'description',
            'type',
            'status',
            'price',
            'address',
            'features',
            'amenities',
            'images',
            'owner'
        ];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates' });
        }

        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if user is the agent or admin
        if (property.agent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this property' });
        }

        updates.forEach(update => property[update] = req.body[update]);
        property.lastUpdated = Date.now();
        await property.save();

        res.json(property);
    } catch (error) {
        res.status(500).json({ message: 'Error updating property', error: error.message });
    }
};

// Delete property
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if user is the agent or admin
        if (property.agent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this property' });
        }

        await property.remove();
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting property', error: error.message });
    }
};

// Search properties
exports.searchProperties = async (req, res) => {
    try {
        const {
            type,
            minPrice,
            maxPrice,
            bedrooms,
            bathrooms,
            city,
            state,
            status
        } = req.query;

        const query = {};

        if (type) query.type = type;
        if (status) query.status = status;
        if (city) query['address.city'] = new RegExp(city, 'i');
        if (state) query['address.state'] = new RegExp(state, 'i');
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (bedrooms) query['features.bedrooms'] = { $gte: Number(bedrooms) };
        if (bathrooms) query['features.bathrooms'] = { $gte: Number(bathrooms) };

        const properties = await Property.find(query)
            .populate('agent', 'name email')
            .sort({ createdAt: -1 });

        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error searching properties', error: error.message });
    }
};

// Get agent's properties
exports.getAgentProperties = async (req, res) => {
    try {
        const properties = await Property.find({ agent: req.user._id })
            .sort({ createdAt: -1 });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching agent properties', error: error.message });
    }
};

// Toggle property favorite
exports.toggleFavorite = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        await property.toggleFavorite();
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: 'Error toggling favorite', error: error.message });
    }
}; 