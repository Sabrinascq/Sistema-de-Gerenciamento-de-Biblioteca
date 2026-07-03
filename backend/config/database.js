// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'software',
  database: process.env.DB_NAME || 'biblioteca_db',
  port: 5432, // Porta padrão do PostgreSQL
  logging: false,
  dialectOptions: {
    // Esse bloco previne problemas de conexões locais com protocolos estritos
    connectTimeout: 60000 
  }
});

module.exports = sequelize;