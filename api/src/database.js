import Sequelize from 'sequelize';

const db = {};

const sequelize = new Sequelize({ "dialect": "sqlite", "storage": "/app/static/jandjarchive.db" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.checkConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export default db;