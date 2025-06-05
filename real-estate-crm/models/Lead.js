const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    source: {
        type: String,
        enum: ['website', 'referral', 'social-media', 'zillow', 'realtor', 'other'],
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'unqualified', 'converted', 'lost'],
        default: 'new'
    },
    type: {
        type: String,
        enum: ['buyer', 'seller', 'both'],
        required: true
    },
    assignedAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    followUpDate: {
        type: Date
    },
    lastContact: {
        type: Date,
        default: Date.now
    },
    preferences: {
        propertyTypes: [{
            type: String,
            enum: ['residential', 'commercial', 'land', 'industrial']
        }],
        minPrice: Number,
        maxPrice: Number,
        locations: [{
            city: String,
            state: String
        }]
    },
    conversionDate: {
        type: Date
    },
    convertedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    }
}, {
    timestamps: true
});

// Create indexes for common queries
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ assignedAgent: 1 });
leadSchema.index({ followUpDate: 1 });

// Method to add a note
leadSchema.methods.addNote = async function(content, userId) {
    this.notes.push({
        content,
        createdBy: userId
    });
    return this.save();
};

// Method to update status
leadSchema.methods.updateStatus = async function(newStatus) {
    this.status = newStatus;
    if (newStatus === 'converted') {
        this.conversionDate = Date.now();
    }
    return this.save();
};

// Method to schedule follow-up
leadSchema.methods.scheduleFollowUp = async function(date) {
    this.followUpDate = date;
    return this.save();
};

// Method to convert to client
leadSchema.methods.convertToClient = async function(clientId) {
    this.status = 'converted';
    this.conversionDate = Date.now();
    this.convertedTo = clientId;
    return this.save();
};

// Method to update last contact
leadSchema.methods.updateLastContact = async function() {
    this.lastContact = Date.now();
    return this.save();
};

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead; 