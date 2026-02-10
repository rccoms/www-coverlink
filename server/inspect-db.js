const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    provider: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING },
    vehicleNumber: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING },
    statusKey: { type: DataTypes.STRING },
    statusMessage: { type: DataTypes.STRING },
    loginTime: { type: DataTypes.DATE }
});

async function inspect() {
    try {
        const users = await User.findAll();
        console.log('--- Current Database Content ---');
        console.log(JSON.stringify(users, null, 2));
        console.log('--------------------------------');
    } catch (e) {
        console.error('Error querying database:', e);
    }
}

inspect();
