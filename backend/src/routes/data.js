const express = require('express');
const router = express.Router();
const { GeneratedData } = require('../models/GeneratedData');
const { verifyToken } = require('./auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const data = await GeneratedData.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const data = await GeneratedData.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });
        
        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }
        
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const result = await GeneratedData.destroy({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });
        
        if (result === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }
        
        res.json({ message: 'Data deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting data' });
    }
});

module.exports = router; 