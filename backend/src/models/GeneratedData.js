const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

console.log('Initializing GeneratedData model...');

const GeneratedData = sequelize.define('GeneratedData', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parameters: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    result: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'userId',
        references: {
            model: 'Users',
            key: 'id'
        }
    }
}, {
    tableName: 'GeneratedData',
    timestamps: true,
    underscored: false,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

GeneratedData.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

User.hasMany(GeneratedData, {
    foreignKey: 'userId',
    as: 'generatedData'
});

sequelize.sync()
    .then(() => {
        console.log('GeneratedData model synced with database');
    })
    .catch(err => {
        console.error('Error syncing GeneratedData model:', err);
    });

module.exports = GeneratedData; 