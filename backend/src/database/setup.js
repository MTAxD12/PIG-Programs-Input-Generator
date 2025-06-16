const sequelize = require('../config/database');
const User = require('../models/User');
const GeneratedData = require('../models/GeneratedData');

async function initializeDatabase() {
    try {
        // Sincronizăm mai întâi User
        await User.sync({ force: true });
        console.log('Users table created successfully');

        // Apoi sincronizăm GeneratedData
        await GeneratedData.sync({ force: true });
        console.log('GeneratedData table created successfully');

        // Creăm utilizatorul admin
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