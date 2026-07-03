const { Op } = require('sequelize');
const Livro = require('../models/Livro');

const LivroController = {

  // ===========================
  // Cadastrar Livro
  // ===========================
  create: async (req, res) => {
    try {
      const { titulo, autor, editora, ano_publicacao, categoria, isbn, quantidade_total } = req.body;

      const livroExistente = await Livro.findOne({ where: { isbn } });

      if (livroExistente) {
        return res.status(400).json({ erro: 'Já existe um livro com esse ISBN.' });
      }

      const livro = await Livro.create({
        titulo, autor, editora, ano_publicacao, categoria, isbn, quantidade_total,
        quantidade_disponivel: quantidade_total,
        status: quantidade_total > 0 ? 'disponível' : 'indisponível'
      });

      return res.status(201).json({ mensagem: 'Livro cadastrado com sucesso.', livro });
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao cadastrar livro.', detalhes: error.message });
    }
  },

  // ===========================
  // Listar Livros (Com Paginação)
  // ===========================
  getAll: async (req, res) => {
    try {
      // Captura a página atual, limite de 5 por página para podermos ver a paginação funcionando rápido
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5; 
      const offset = (page - 1) * limit;

      const { count, rows } = await Livro.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [['id', 'DESC']] // Ordena do mais novo para o mais antigo
      });

      return res.json({
        livros: rows,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });

    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ===========================
  // Buscar Livro por ID
  // ===========================
  getById: async (req, res) => {
    try {
      const livro = await Livro.findByPk(req.params.id);
      if (!livro) return res.status(404).json({ erro: 'Livro não encontrado.' });
      return res.json(livro);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ===========================
  // Atualizar Livro
  // ===========================
  update: async (req, res) => {
    try {
      const livro = await Livro.findByPk(req.params.id);
      if (!livro) return res.status(404).json({ erro: 'Livro não encontrado.' });

      await livro.update(req.body);

      if (livro.quantidade_disponivel <= 0) {
        await livro.update({ status: 'indisponível' });
      } else {
        await livro.update({ status: 'disponível' });
      }

      return res.json({ mensagem: 'Livro atualizado com sucesso.', livro });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ===========================
  // Excluir Livro
  // ===========================
  delete: async (req, res) => {
    try {
      const livro = await Livro.findByPk(req.params.id);
      if (!livro) return res.status(404).json({ erro: 'Livro não encontrado.' });

      await livro.destroy();
      return res.json({ mensagem: 'Livro excluído com sucesso.' });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ===========================
  // Buscar Livros (Com Paginação e Filtros)
  // ===========================
  search: async (req, res) => {
    try {
      const { titulo, autor, categoria, status, isbn } = req.query;
      
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const offset = (page - 1) * limit;

      let where = {};
      if (titulo) where.titulo = { [Op.iLike]: `%${titulo}%` };
      if (autor) where.autor = { [Op.iLike]: `%${autor}%` };
      if (categoria) where.categoria = { [Op.iLike]: `%${categoria}%` };
      if (isbn) where.isbn = { [Op.iLike]: `%${isbn}%` };
      if (status) where.status = status;

      const { count, rows } = await Livro.findAndCountAll({ 
        where,
        limit: limit,
        offset: offset,
        order: [['id', 'DESC']]
      });

      return res.json({
        livros: rows,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }
};

module.exports = LivroController;