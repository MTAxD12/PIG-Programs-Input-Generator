const express = require('express');
const router = express.Router();
const GeneratedData = require('../models/GeneratedData');
const { verifyToken } = require('./auth');
const sequelize = require('../config/database');

sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const generateNumberSequence = (length, min, max, properties) => {
    if (properties.includes('unique')) {
        const range = max - min + 1;
        if (range < length) {
            throw new Error(`Cannot generate ${length} unique numbers in range [${min}, ${max}] (range is only ${range} numbers)`);
        }
    }

    if (properties.includes('prime')) {
        let primeCount = 0;
        for (let i = min; i <= max; i++) {
            if (isPrime(i)) primeCount++;
        }
        if (primeCount < length) {
            throw new Error(`Cannot generate ${length} prime numbers in range [${min}, ${max}] (only ${primeCount} prime numbers available)`);
        }
    }

    if (properties.includes('even')) {
        const evenCount = Math.floor((max - min + 1) / 2) + (min % 2 === 0 && max % 2 === 0 ? 1 : 0);
        if (evenCount < length) {
            throw new Error(`Cannot generate ${length} even numbers in range [${min}, ${max}] (only ${evenCount} even numbers available)`);
        }
    }

    if (properties.includes('odd')) {
        const oddCount = Math.floor((max - min + 1) / 2) + (min % 2 === 1 && max % 2 === 1 ? 1 : 0);
        if (oddCount < length) {
            throw new Error(`Cannot generate ${length} odd numbers in range [${min}, ${max}] (only ${oddCount} odd numbers available)`);
        }
    }

    let numbers = [];
    let attempts = 0;
    const maxAttempts = 1000; 
    
    while (numbers.length < length && attempts < maxAttempts) {
        attempts++;
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        
        let valid = true;
        
        if (properties.includes('unique') && numbers.includes(num)) {
            valid = false;
        }
        
        if (properties.includes('prime') && !isPrime(num)) {
            valid = false;
        }
        
        if (properties.includes('even') && num % 2 !== 0) {
            valid = false;
        }
        
        if (properties.includes('odd') && num % 2 === 0) {
            valid = false;
        }
        
        if (valid) {
            numbers.push(num);
        }
    }

    if (numbers.length < length) {
        throw new Error(`Failed to generate ${length} numbers with the specified properties after ${maxAttempts} attempts. Try adjusting the range or properties.`);
    }

    if (properties.includes('sorted')) {
        numbers.sort((a, b) => a - b);
    }

    if (properties.includes('sorted-desc')) {
        numbers.sort((a, b) => b - a);
    }

    return numbers;
};

const isPrime = (num) => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
};

const generateMatrix = (rows, cols, min, max, properties) => {
    if (min > max) {
        throw new Error('Minimum value cannot be greater than maximum value');
    }

    if (rows <= 0 || cols <= 0) {
        throw new Error('Matrix dimensions must be positive');
    }

    const matrix = [];
    
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        matrix.push(row);
    }

    if (properties.includes('symmetric')) {
        if (rows !== cols) {
            throw new Error('Symmetric matrix must be square');
        }
        for (let i = 0; i < rows; i++) {
            for (let j = i + 1; j < cols; j++) {
                matrix[j][i] = matrix[i][j];
            }
        }
    }

    if (properties.includes('diagonal')) {
        if (rows !== cols) {
            throw new Error('Diagonal matrix must be square');
        }
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (i !== j) matrix[i][j] = 0;
            }
        }
    }

    if (properties.includes('upper-triangular')) {
        if (rows !== cols) {
            throw new Error('Upper triangular matrix must be square');
        }
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < i; j++) {
                matrix[i][j] = 0;
            }
        }
    }

    if (properties.includes('lower-triangular')) {
        if (rows !== cols) {
            throw new Error('Lower triangular matrix must be square');
        }
        for (let i = 0; i < rows; i++) {
            for (let j = i + 1; j < cols; j++) {
                matrix[i][j] = 0;
            }
        }
    }

    if (properties.includes('binary')) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                matrix[i][j] = Math.random() < 0.5 ? 0 : 1;
            }
        }
    }

    return matrix;
};

const generateString = (length, alphabet, properties) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    if (properties.includes('palindrome')) {
        const half = Math.floor(length / 2);
        const firstHalf = result.slice(0, half);
        result = firstHalf + (length % 2 ? result[half] : '') + firstHalf.split('').reverse().join('');
    }

    return result;
};

router.post('/numbers/generate', verifyToken, async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        console.log('Request body type:', typeof req.body);
        console.log('Request headers:', req.headers);
        console.log('Content-Type:', req.headers['content-type']);
        
        if (typeof req.body === 'string') {
            try {
                req.body = JSON.parse(req.body);
            } catch (e) {
                console.error('Failed to parse request body:', e);
                return res.status(400).json({ error: 'Invalid JSON in request body' });
            }
        }

        const { length, min, max, properties } = req.body;

        console.log('Parsed values:', {
            length,
            min,
            max,
            properties,
            lengthType: typeof length,
            minType: typeof min,
            maxType: typeof max,
            propertiesType: typeof properties,
            isPropertiesArray: Array.isArray(properties)
        });

        if (length === undefined || min === undefined || max === undefined) {
            console.log('Missing parameters:', { 
                length: length === undefined ? 'missing' : 'present',
                min: min === undefined ? 'missing' : 'present',
                max: max === undefined ? 'missing' : 'present',
                properties: properties === undefined ? 'missing' : 'present'
            });
            return res.status(400).json({ 
                error: 'Missing required parameters',
                details: {
                    length: length === undefined ? 'missing' : 'present',
                    min: min === undefined ? 'missing' : 'present',
                    max: max === undefined ? 'missing' : 'present',
                    properties: properties === undefined ? 'missing' : 'present'
                }
            });
        }

        const numLength = Number(length);
        const numMin = Number(min);
        const numMax = Number(max);

        console.log('Converted values:', {
            numLength,
            numMin,
            numMax,
            properties
        });

        if (isNaN(numLength) || isNaN(numMin) || isNaN(numMax)) {
            console.log('Invalid numeric values:', {
                numLength,
                numMin,
                numMax
            });
            return res.status(400).json({ 
                error: 'Invalid numeric values',
                details: {
                    length: isNaN(numLength) ? 'invalid' : 'valid',
                    min: isNaN(numMin) ? 'invalid' : 'valid',
                    max: isNaN(numMax) ? 'invalid' : 'valid'
                }
            });
        }

        if (numLength <= 0) {
            return res.status(400).json({ error: 'Length must be positive' });
        }

        if (numMin > numMax) {
            return res.status(400).json({ error: 'Minimum value cannot be greater than maximum value' });
        }

        console.log('Generating sequence with params:', { numLength, numMin, numMax, properties });
        const numbers = generateNumberSequence(numLength, numMin, numMax, properties || []);

        console.log('Generated sequence:', numbers);

        const data = await GeneratedData.create({
            userId: req.user.id,
            type: 'numbers',
            parameters: {
                length: numLength,
                min: numMin,
                max: numMax,
                properties: properties || []
            },
            result: numbers
        });

        res.json({ 
            id: data.id, 
            result: numbers,
            metadata: {
                length: numbers.length,
                min: Math.min(...numbers),
                max: Math.max(...numbers),
                properties: properties || []
            }
        });
    } catch (err) {
        console.error('Error in numbers generation:', err);
        res.status(400).json({ 
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

router.post('/matrices/generate', verifyToken, async (req, res) => {
    try {
        const { rows, cols, min, max, properties } = req.body;

        if (!rows || !cols || min === undefined || max === undefined) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const matrix = generateMatrix(rows, cols, min, max, properties || []);

        const data = await GeneratedData.create({
            userId: req.user.id,
            type: 'matrix',
            parameters: req.body,
            result: matrix
        });

        res.json({ 
            id: data.id, 
            result: matrix,
            metadata: {
                rows: matrix.length,
                cols: matrix[0].length,
                properties: properties || []
            }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/strings/generate', verifyToken, async (req, res) => {
    const { length, alphabet, properties } = req.body;

    if (!length || !alphabet) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const string = generateString(length, alphabet, properties || []);

    try {
        const data = await GeneratedData.create({
            userId: req.user.id,
            type: 'string',
            parameters: req.body,
            result: string
        });
        res.json({ id: data.id, result: string });
    } catch (err) {
        res.status(500).json({ error: 'Error saving data' });
    }
});

router.post('/graphs/generate', verifyToken, async (req, res) => {
    const { nodes, edges, directed, weighted, properties } = req.body;

    if (!nodes || !edges) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const matrix = Array(nodes).fill().map(() => Array(nodes).fill(0));
    const edgeList = [];

    for (let i = 0; i < edges; i++) {
        const from = Math.floor(Math.random() * nodes);
        let to;
        do {
            to = Math.floor(Math.random() * nodes);
        } while (to === from && !directed);

        const weight = weighted ? Math.floor(Math.random() * 100) + 1 : 1;
        matrix[from][to] = weight;
        if (!directed) {
            matrix[to][from] = weight;
        }
        edgeList.push({ from, to, weight });
    }

    const graph = {
        nodes: Array(nodes).fill().map((_, i) => ({ id: i })),
        edges: edgeList,
        matrix
    };

    try {
        const data = await GeneratedData.create({
            userId: req.user.id,
            type: 'graph',
            parameters: req.body,
            result: graph
        });
        res.json({ id: data.id, result: graph });
    } catch (err) {
        res.status(500).json({ error: 'Error saving data' });
    }
});

router.get('/graphs/:id/svg', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const data = await GeneratedData.findOne({
            where: {
                id: id,
                userId: req.user.id,
                type: 'graph'
            }
        });

        if (!data) {
            return res.status(404).json({ error: 'Graph not found' });
        }

        const graph = data.result;
        const svg = generateGraphSVG(graph);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

const generateGraphSVG = (graph) => {
    const width = 600;
    const height = 400;
    const radius = 20;
    const nodePositions = {};

    graph.nodes.forEach((node, i) => {
        const angle = (i * 2 * Math.PI) / graph.nodes.length;
        nodePositions[node.id] = {
            x: width/2 + (width/3) * Math.cos(angle),
            y: height/2 + (height/3) * Math.sin(angle)
        };
    });

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

    graph.edges.forEach(edge => {
        const from = nodePositions[edge.from];
        const to = nodePositions[edge.to];
        svg += `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="black" stroke-width="2"/>`;
        if (edge.weight) {
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            svg += `<text x="${midX}" y="${midY}" text-anchor="middle" fill="red">${edge.weight}</text>`;
        }
    });

    graph.nodes.forEach(node => {
        const pos = nodePositions[node.id];
        svg += `<circle cx="${pos.x}" cy="${pos.y}" r="${radius}" fill="white" stroke="black" stroke-width="2"/>`;
        svg += `<text x="${pos.x}" y="${pos.y}" text-anchor="middle" dominant-baseline="middle">${node.id}</text>`;
    });

    svg += '</svg>';
    return svg;
};

router.get('/numbers/:id/export', verifyToken, async (req, res) => {
    try {
        const data = await GeneratedData.findOne({
            where: { id: req.params.id, userId: req.user.id, type: 'numbers' }
        });

        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const format = req.query.format || 'json';
        
        if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=numbers.csv');
            res.send(data.result.join(','));
        } else {
            res.json(data.result);
        }
    } catch (err) {
        res.status(500).json({ error: 'Error exporting data' });
    }
});

router.get('/matrices/:id/export', verifyToken, async (req, res) => {
    try {
        const data = await GeneratedData.findOne({
            where: { id: req.params.id, userId: req.user.id, type: 'matrix' }
        });

        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const format = req.query.format || 'json';
        
        if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=matrix.csv');
            const csv = data.result.map(row => row.join(',')).join('\n');
            res.send(csv);
        } else {
            res.json(data.result);
        }
    } catch (err) {
        res.status(500).json({ error: 'Error exporting data' });
    }
});

module.exports = router; 