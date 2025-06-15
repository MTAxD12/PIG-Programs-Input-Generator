const sequelize = require('../config/database');
const User = require('../models/User');
const GeneratedData = require('../models/GeneratedData');

async function initializeDatabase() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synchronized successfully');

        await User.create({
            username: 'admin',
            email: 'admin@pig.com',
            password: 'admin123',
            role: 'admin'
        });

        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase().then(() => {
    process.exit(0);
}); 