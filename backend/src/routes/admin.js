const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { GeneratedData } = require('../models/GeneratedData');
const { verifyToken, verifyAdmin } = require('./auth');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'role', 'createdAt']
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalData = await GeneratedData.count();
        
        const dataByType = await GeneratedData.findAll({
            attributes: ['type', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['type']
        });

        res.json({
            totalUsers,
            totalData,
            dataByType
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching statistics' });
    }
});

router.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const result = await User.destroy({
            where: {
                id: req.params.id,
                role: { [Op.ne]: 'admin' } 
            }
        });

        if (result === 0) {
            return res.status(404).json({ error: 'User not found or cannot be deleted' });
        }

        await GeneratedData.destroy({
            where: { userId: req.params.id }
        });

        res.json({ message: 'User and associated data deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

router.get('/logs', verifyToken, verifyAdmin, (req, res) => {
    const { limit = 100, offset = 0 } = req.query;

    res.status(500).json({ error: 'System logs retrieval not implemented' });
});

module.exports = router; 