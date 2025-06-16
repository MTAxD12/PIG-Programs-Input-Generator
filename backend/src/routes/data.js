const express = require('express');
const router = express.Router();
const GeneratedData = require('../models/GeneratedData');
const { verifyToken } = require('./auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        console.log('Fetching data for user:', req.user.id);
        const data = await GeneratedData.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        console.log('Found data:', data);
        res.json(data);
    } catch (err) {
        console.error('Error in GET /data:', err);
        res.status(500).json({ error: 'Error fetching data', details: err.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        console.log('Fetching data with id:', req.params.id, 'for user:', req.user.id);
        const data = await GeneratedData.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });
        
        if (!data) {
            console.log('Data not found');
            return res.status(404).json({ error: 'Data not found' });
        }
        
        console.log('Found data:', data);
        res.json(data);
    } catch (err) {
        console.error('Error in GET /data/:id:', err);
        res.status(500).json({ error: 'Error fetching data', details: err.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        console.log('Deleting data with id:', req.params.id, 'for user:', req.user.id);
        const result = await GeneratedData.destroy({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });
        
        if (result === 0) {
            console.log('Data not found for deletion');
            return res.status(404).json({ error: 'Data not found' });
        }
        
        console.log('Data deleted successfully');
        res.json({ message: 'Data deleted successfully' });
    } catch (err) {
        console.error('Error in DELETE /data/:id:', err);
        res.status(500).json({ error: 'Error deleting data', details: err.message });
    }
});

module.exports = router; 