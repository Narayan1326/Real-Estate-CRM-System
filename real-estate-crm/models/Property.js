const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['residential', 'commercial', 'land', 'industrial'],
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'pending', 'sold', 'off-market'],
        default: 'available'
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    address: {
        street: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        zipCode: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            required: true,
            trim: true,
            default: 'USA'
        }
    },
    features: {
        bedrooms: {
            type: Number,
            min: 0
        },
        bathrooms: {
            type: Number,
            min: 0
        },
        squareFeet: {
            type: Number,
            min: 0
        },
        lotSize: {
            type: Number,
            min: 0
        },
        yearBuilt: {
            type: Number
        },
        parking: {
            type: Number,
            min: 0
        }
    },
    amenities: [{
        type: String,
        trim: true
    }],
    images: [{
        url: String,
        caption: String
    }],
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        name: String,
        email: String,
        phone: String
    },
    listingDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    favorites: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Create indexes for common queries
propertySchema.index({ 'address.city': 1, 'address.state': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ type: 1, status: 1 });
propertySchema.index({ agent: 1 });

// Virtual for full address
propertySchema.virtual('fullAddress').get(function() {
    return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Method to increment views
propertySchema.methods.incrementViews = async function() {
    this.views += 1;
    return this.save();
};

// Method to toggle favorite
propertySchema.methods.toggleFavorite = async function() {
    this.favorites += 1;
    return this.save();
};

const Property = mongoose.model('Property', propertySchema);

module.exports = Property; 