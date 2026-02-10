const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client'))); // Serve frontend

// Database setup (SQLite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

// User Model
const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING
    },
    vehicleNumber: {
        type: DataTypes.STRING
    },
    phoneNumber: {
        type: DataTypes.STRING
    },
    phoneNumber: {
        type: DataTypes.STRING
    },
    statusKey: {
        type: DataTypes.STRING,
        defaultValue: 'available'
    },
    statusMessage: {
        type: DataTypes.STRING
    },
    loginTime: {
        type: DataTypes.DATE
    }
});

// Sync Database
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
});

// API Endpoints

// Login / Auth (Create or Update User)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, name, provider, avatar } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const [user, created] = await User.findOrCreate({
            where: { email },
            defaults: {
                name,
                provider,
                avatar,
                loginTime: new Date()
            }
        });

        if (!created) {
            // Update login time and other info if changed
            user.name = name;
            user.avatar = avatar;
            user.loginTime = new Date();
            await user.save();
        }

        res.json(user);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get User
app.get('/api/user/:email', async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.params.email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Vehicle Number
app.put('/api/user/:email/vehicle', async (req, res) => {
    try {
        const { vehicleNumber } = req.body;
        const user = await User.findOne({ where: { email: req.params.email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.vehicleNumber = vehicleNumber;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete Vehicle Number
app.delete('/api/user/:email/vehicle', async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.params.email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.vehicleNumber = null;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Phone Number
app.put('/api/user/:email/phone', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const user = await User.findOne({ where: { email: req.params.email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.phoneNumber = phoneNumber;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete Phone Number
app.delete('/api/user/:email/phone', async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.params.email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.phoneNumber = null;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Status
app.put('/api/user/:email/status', async (req, res) => {
    try {
        const { statusKey, statusMessage } = req.body;
        const user = await User.findOne({ where: { email: req.params.email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (statusKey) user.statusKey = statusKey;
        if (statusMessage !== undefined) user.statusMessage = statusMessage; // Allow empty string

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
