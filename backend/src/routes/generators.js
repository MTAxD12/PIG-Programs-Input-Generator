const express = require('express');
const router = express.Router();
const { GeneratedData } = require('../models/GeneratedData');
const { verifyToken } = require('./auth');

const generateNumberSequence = (length, min, max, properties) => {
    let numbers = [];
    for (let i = 0; i < length; i++) {
        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    if (properties.includes('unique')) {
        numbers = [...new Set(numbers)];
    }

    if (properties.includes('sorted')) {
        numbers.sort((a, b) => a - b);
    }

    if (properties.includes('prime')) {
        numbers = numbers.filter(isPrime);
    }

    if (properties.includes('even')) {
        numbers = numbers.filter(n => n % 2 === 0);
    }

    if (properties.includes('odd')) {
        numbers = numbers.filter(n => n % 2 === 1);
    }

    return numbers;
};

const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const generateMatrix = (rows, cols, min, max, properties) => {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        matrix.push(row);
    }

    if (properties.includes('symmetric')) {
        for (let i = 0; i < rows; i++) {
            for (let j = i + 1; j < cols; j++) {
                matrix[j][i] = matrix[i][j];
            }
        }
    }

    if (properties.includes('diagonal')) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (i !== j) matrix[i][j] = 0;
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
    const { length, min, max, properties } = req.body;

    if (!length || min === undefined || max === undefined) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const numbers = generateNumberSequence(length, min, max, properties || []);

    try {
        const data = await GeneratedData.create({
            userId: req.user.id,
            type: 'numbers',
            parameters: req.body,
            result: numbers
        });
        res.json({ id: data.id, result: numbers });
    } catch (err) {
        res.status(500).json({ error: 'Error saving data' });
    }
});

router.post('/matrices/generate', verifyToken, async (req, res) => {
    const { rows, cols, min, max, properties } = req.body;

    if (!rows || !cols || min === undefined || max === undefined) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const matrix = generateMatrix(rows, cols, min, max, properties || []);

    try {
        const data = await GeneratedData.create({
            userId: req.user.id,
            type: 'matrix',
            parameters: req.body,
            result: matrix
        });
        res.json({ id: data.id, result: matrix });
    } catch (err) {
        res.status(500).json({ error: 'Error saving data' });
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

module.exports = router; 