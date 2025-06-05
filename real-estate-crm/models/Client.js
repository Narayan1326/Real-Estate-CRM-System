const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['buyer', 'seller', 'both'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'closed'],
        default: 'active'
    },
    preferences: {
        propertyTypes: [{
            type: String,
            enum: ['residential', 'commercial', 'land', 'industrial']
        }],
        minPrice: Number,
        maxPrice: Number,
        minBedrooms: Number,
        minBathrooms: Number,
        minSquareFeet: Number,
        locations: [{
            city: String,
            state: String
        }]
    },
    notes: [{
        content: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    assignedAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    source: {
        type: String,
        enum: ['website', 'referral', 'walk-in', 'social-media', 'other'],
        default: 'website'
    },
    lastContact: {
        type: Date,
        default: Date.now
    },
    properties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }],
    documents: [{
        name: String,
        url: String,
        type: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Create indexes for common queries
clientSchema.index({ email: 1 });
clientSchema.index({ assignedAgent: 1 });
clientSchema.index({ status: 1 });
clientSchema.index({ type: 1 });

// Method to add a note
clientSchema.methods.addNote = async function(content, userId) {
    this.notes.push({
        content,
        createdBy: userId
    });
    return this.save();
};

// Method to update last contact
clientSchema.methods.updateLastContact = async function() {
    this.lastContact = Date.now();
    return this.save();
};

// Method to add a property
clientSchema.methods.addProperty = async function(propertyId) {
    if (!this.properties.includes(propertyId)) {
        this.properties.push(propertyId);
        return this.save();
    }
    return this;
};

// Method to add a document
clientSchema.methods.addDocument = async function(name, url, type) {
    this.documents.push({
        name,
        url,
        type
    });
    return this.save();
};

const Client = mongoose.model('Client', clientSchema);

module.exports = Client; 