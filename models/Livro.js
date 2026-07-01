const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Livro = sequelize.define('Livro', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  autor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  editora: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ano_publicacao: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  quantidade_total: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantidade_disponivel: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('disponível', 'indisponível'),
    allowNull: false,
    defaultValue: 'disponível'
  }
});

module.exports = Livro;