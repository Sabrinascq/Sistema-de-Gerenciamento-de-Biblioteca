const { DataTypes } = require('sequelize');
const sequelize = require('../backend/config/database');
const Leitor = require('./Leitor');
const Livro = require('./Livro');

const Emprestimo = sequelize.define('Emprestimo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  data_emprestimo: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  data_prevista_devolucao: {
    type: DataTypes.DATE,
    allowNull: false
  },
  data_real_devolucao: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('aberto', 'devolvido', 'atrasado'),
    defaultValue: 'aberto'
  }
});

// Relacionamentos
Emprestimo.belongsTo(Leitor, { foreignKey: 'leitorId' });
Emprestimo.belongsTo(Livro, { foreignKey: 'livroId' });

module.exports = Emprestimo;