const Livro = require('../models/Livro');
const Leitor = require('../models/Leitor');
const Emprestimo = require('../models/Emprestimo');
const User = require('../models/User');

const RelatorioController = {
  getResumo: async (req, res) => {
    try {
      // Fazendo as contagens no banco de dados
      const totalLivros = await Livro.count();
      const totalLeitores = await Leitor.count();
      const leitoresAtivos = await Leitor.count({ where: { status: 'ativo' } });
      const totalUsuarios = await User.count();
      
      const totalEmprestimos = await Emprestimo.count();
      const emprestimosAbertos = await Emprestimo.count({ where: { status: 'Em aberto' } });
      const emprestimosAtrasados = await Emprestimo.count({ where: { status: 'Atrasado' } });

      return res.json({
        acervo: {
          total_livros: totalLivros
        },
        pessoas: {
          total_leitores: totalLeitores,
          leitores_ativos: leitoresAtivos,
          total_usuarios: totalUsuarios
        },
        movimentacao: {
          total_emprestimos: totalEmprestimos,
          emprestimos_abertos: emprestimosAbertos,
          emprestimos_atrasados: emprestimosAtrasados
        }
      });
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao gerar relatório.', detalhes: error.message });
    }
  }
};

module.exports = RelatorioController;