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
        const { rows, columns, min, max, properties } = req.body;

        if (!rows || !columns || !min || !max) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const numRows = Number(rows);
        const numColumns = Number(columns);
        const numMin = Number(min);
        const numMax = Number(max);

        if (isNaN(numRows) || isNaN(numColumns) || isNaN(numMin) || isNaN(numMax)) {
            return res.status(400).json({ error: 'Invalid numeric parameters' });
        }

        const matrix = generateMatrix(numRows, numColumns, numMin, numMax, properties || []);

        if (req.user) {
            await GeneratedData.create({
                userId: req.user.id,
                type: 'matrix',
                parameters: {
                    rows: numRows,
                    columns: numColumns,
                    min: numMin,
                    max: numMax,
                    properties: properties || []
                },
                result: matrix
            });
        }

        res.json({ data: matrix });
    } catch (error) {
        console.error('Error generating matrix:', error);
        res.status(400).json({ error: error.message });
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
    const isDirected = Boolean(directed);
    let currentEdges = 0;
    let attempts = 0;
    const maxAttempts = 1000; 

    while (currentEdges < edges && attempts < maxAttempts) {
        attempts++;
        const from = Math.floor(Math.random() * nodes);
        const to = Math.floor(Math.random() * nodes);

        if (from === to) {
            continue;
        }

        if (!isDirected && matrix[from][to] !== 0) {
            continue;
        }

        if (isDirected && matrix[from][to] !== 0) {
            continue;
        }

        const weight = weighted ? Math.floor(Math.random() * 100) + 1 : 1;
        matrix[from][to] = weight;
        if (!isDirected) {
            matrix[to][from] = weight;
        }
        edgeList.push({ from, to, weight });
        currentEdges++;
    }

    if (currentEdges < edges) {
        return res.status(400).json({ 
            error: 'Could not generate the requested number of edges. Try reducing the number of edges or increasing the number of nodes.' 
        });
    }

    const graph = {
        nodes: Array(nodes).fill().map((_, i) => ({ id: i })),
        edges: edgeList,
        matrix,
        directed: isDirected
    };

    try {
        const data = await GeneratedData.create({
            userId: req.user.id,
            type: 'graph',
            parameters: {
                ...req.body,
                directed: isDirected
            },
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
            
            if (graph.nodes.length >= 10) {
                return res.status(400).json({ error: 'SVG export is only available for graphs with less than 10 nodes' });
            }

            const svg = generateGraphSVG(graph);
            res.set('Content-Type', 'image/svg+xml');
            res.send(svg);
        } catch (err) {
            res.status(500).json({ error: 'Error generating SVG' });
        }
    });

    const generateGraphSVG = (graph) => {
        const width = 600;
        const height = 400;
        const radius = 20;
        const padding = 50; 
        
        if (!graph || !graph.nodes || !Array.isArray(graph.nodes) || graph.nodes.length === 0) {
            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <text x="${width/2}" y="${height/2}" text-anchor="middle" fill="red">Invalid graph data</text>
            </svg>`;
        }
        
        const nodePositions = {};
        const nodeCount = graph.nodes.length;
        

        graph.nodes.forEach((node, i) => {
            const angle = (i * 2 * Math.PI) / nodeCount;
            const centerX = width / 2;
            const centerY = height / 2;
            const radiusX = (width - 2 * padding - 2 * radius) / 2;
            const radiusY = (height - 2 * padding - 2 * radius) / 2;
            
            nodePositions[node.id] = {
                x: centerX + radiusX * Math.cos(angle),
                y: centerY + radiusY * Math.sin(angle)
            };
        });
    

        let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
        
        svg += `<rect width="${width}" height="${height}" fill="white" stroke="black" stroke-width="1"/>`;
        
        if (graph.edges && Array.isArray(graph.edges)) {
            graph.edges.forEach(edge => {
                const fromPos = nodePositions[edge.from];
                const toPos = nodePositions[edge.to];
                
                if (fromPos && toPos) {
                    const dx = toPos.x - fromPos.x;
                    const dy = toPos.y - fromPos.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 0) {
                        const unitX = dx / distance;
                        const unitY = dy / distance;
                        
                        const startX = fromPos.x + radius * unitX;
                        const startY = fromPos.y + radius * unitY;
                        const endX = toPos.x - radius * unitX;
                        const endY = toPos.y - radius * unitY;
                        
                        svg += `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" 
                                stroke="#333" stroke-width="2" opacity="0.8"/>`;
                        
                        if (graph.directed === true) { 
                            const arrowSize = 8;
                            const arrowX1 = endX - arrowSize * unitX - arrowSize * unitY / 2;
                            const arrowY1 = endY - arrowSize * unitY + arrowSize * unitX / 2;
                            const arrowX2 = endX - arrowSize * unitX + arrowSize * unitY / 2;
                            const arrowY2 = endY - arrowSize * unitY - arrowSize * unitX / 2;
                            
                            svg += `<polygon points="${endX},${endY} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}" 
                                    fill="#333" opacity="0.8"/>`;
                        }
                        
                        if (edge.weight && edge.weight !== 1) {
                            const midX = (startX + endX) / 2;
                            const midY = (startY + endY) / 2;
                            
                            svg += `<circle cx="${midX}" cy="${midY}" r="12" fill="white" 
                                    stroke="#666" stroke-width="1" opacity="0.9"/>`;
                            svg += `<text x="${midX}" y="${midY}" text-anchor="middle" 
                                    dominant-baseline="middle" font-size="12" font-weight="bold" fill="#d32f2f">
                                    ${edge.weight}</text>`;
                        }
                    }
                }
            });
        }
    
        graph.nodes.forEach(node => {
            const pos = nodePositions[node.id];
            if (pos) {
                svg += `<circle cx="${pos.x}" cy="${pos.y}" r="${radius}" 
                        fill="#e3f2fd" stroke="#1976d2" stroke-width="3"/>`;
                
                svg += `<circle cx="${pos.x + 2}" cy="${pos.y + 2}" r="${radius}" 
                        fill="#000" opacity="0.1" style="z-index: -1"/>`;
                
                svg += `<text x="${pos.x}" y="${pos.y}" text-anchor="middle" 
                        dominant-baseline="middle" font-size="14" font-weight="bold" 
                        fill="#1976d2">${node.id}</text>`;
            }
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