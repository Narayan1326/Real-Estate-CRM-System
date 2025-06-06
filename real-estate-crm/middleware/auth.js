const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate user
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId, isActive: true });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Middleware to check if user is agent
const isAgent = async (req, res, next) => {
    try {
        if (req.user.role !== 'agent' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Agent privileges required.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Middleware to check if user is agent or admin
const isAgentOrAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'agent' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Agent or admin privileges required.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    auth,
    isAdmin,
    isAgent,
    isAgentOrAdmin
}; 