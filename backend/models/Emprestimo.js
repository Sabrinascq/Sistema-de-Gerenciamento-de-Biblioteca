const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
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
    type: DataTypes.ENUM('Em aberto', 'Devolvido', 'Atrasado'),
    defaultValue: 'Em aberto'
  }
});

// Relacionamentos ATUALIZADOS
Emprestimo.belongsTo(Leitor, { foreignKey: 'leitorId' });

// Relação Muitos-para-Muitos: Um empréstimo tem vários livros, e um livro pode estar em vários empréstimos (histórico)
Emprestimo.belongsToMany(Livro, { through: 'EmprestimoLivros', foreignKey: 'emprestimoId' });
Livro.belongsToMany(Emprestimo, { through: 'EmprestimoLivros', foreignKey: 'livroId' });

module.exports = Emprestimo;