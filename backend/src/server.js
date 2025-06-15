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

app.use(helmet());
app.use(xss());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 
});
app.use('/api/', limiter);

app.use(express.static(path.join(__dirname, '../../frontend')));

app.use('/api/auth', authRoutes);
app.use('/api/generators', generatorRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/admin', adminRoutes);

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
}); 