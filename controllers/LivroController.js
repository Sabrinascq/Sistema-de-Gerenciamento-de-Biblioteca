const Livro = require('../models/Livro');

const LivroController = {
  // Função para cadastrar um novo livro
  create: async (req, res) => {
    try {
      const { titulo, autor, editora, ano_publicacao, categoria, isbn, quantidade_total } = req.body;
      
      const novoLivro = await Livro.create({
        titulo,
        autor,
        editora,
        ano_publicacao,
        categoria,
        isbn,
        quantidade_total,
        // Ao cadastrar, a quantidade disponível é igual à quantidade total
        quantidade_disponivel: quantidade_total 
      });

      return res.status(201).json({ mensagem: 'Livro cadastrado com sucesso!', livro: novoLivro });
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao cadastrar o livro. Verifique os dados.' });
    }
  },

  // Função para listar todos os livros
  getAll: async (req, res) => {
    try {
      const livros = await Livro.findAll();
      return res.status(200).json(livros);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao buscar livros.' });
    }
  }
};

module.exports = LivroController;