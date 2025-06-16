const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const path = require('path');

const { router: authRoutes } = require('./routes/auth');
const generatorRoutes = require('./routes/generators');
const dataRoutes = require('./routes/data');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(xss());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/generators', generatorRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/admin', adminRoutes);

app.use(express.static(path.join(__dirname, '../../frontend')));

app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return next();
    }
    
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Frontend is available at http://localhost:${PORT}`);
    console.log(`API is available at http://localhost:${PORT}/api`);
}); 