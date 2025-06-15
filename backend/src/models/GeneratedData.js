const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

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
    }
}, {
    timestamps: true
});

GeneratedData.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
});

User.hasMany(GeneratedData, {
    foreignKey: 'userId'
});

module.exports = GeneratedData; 