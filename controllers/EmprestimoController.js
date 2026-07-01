const Emprestimo = require('../models/Emprestimo');
const Livro = require('../models/Livro');

const EmprestimoController = {
  create: async (req, res) => {
    try {
      const { leitorId, livroId, data_prevista_devolucao } = req.body;
      
      const livro = await Livro.findByPk(livroId);
      if (!livro || livro.quantidade_disponivel <= 0) {
        return res.status(400).json({ erro: 'Livro indisponível para empréstimo.' });
      }

      const novoEmprestimo = await Emprestimo.create({
        leitorId, livroId, data_prevista_devolucao
      });

      // Diminuir a quantidade disponível do livro
      await livro.update({ quantidade_disponivel: livro.quantidade_disponivel - 1 });
      
      return res.status(201).json(novoEmprestimo);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao registrar empréstimo.' });
    }
  },

  getAll: async (req, res) => {
    try {
      const emprestimos = await Emprestimo.findAll({ include: [Livro] });
      return res.status(200).json(emprestimos);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao buscar empréstimos.' });
    }
  }
};

module.exports = EmprestimoController;