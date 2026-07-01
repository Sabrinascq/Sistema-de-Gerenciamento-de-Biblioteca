const Leitor = require('../models/Leitor');
const Emprestimo = require('../models/Emprestimo');
const { Op } = require('sequelize');

const LeitorController = {

  // ==========================
  // Cadastrar Leitor
  // ==========================
  create: async (req, res) => {

    try {

      const leitorExistente = await Leitor.findOne({
        where: {
          cpf_ra: req.body.cpf_ra
        }
      });

      if (leitorExistente) {
        return res.status(400).json({
          erro: 'Já existe um leitor com esse CPF/RA.'
        });
      }

      const leitor = await Leitor.create(req.body);

      return res.status(201).json({
        mensagem: 'Leitor cadastrado com sucesso.',
        leitor
      });

    } catch (error) {

      return res.status(500).json({
        erro: error.message
      });

    }

  },

  // ==========================
  // Listar Leitores
  // ==========================
  getAll: async (req, res) => {

    try {

      const leitores = await Leitor.findAll();

      return res.json(leitores);

    } catch (error) {

      return res.status(500).json({
        erro: error.message
      });

    }

  },

  // ==========================
  // Buscar por ID
  // ==========================
  getById: async (req, res) => {

    try {

      const leitor = await Leitor.findByPk(req.params.id);

      if (!leitor) {

        return res.status(404).json({
          erro: 'Leitor não encontrado.'
        });

      }

      return res.json(leitor);

    } catch (error) {

      return res.status(500).json({
        erro: error.message
      });

    }

  },

  // ==========================
  // Atualizar
  // ==========================
  update: async (req, res) => {

    try {

      const leitor = await Leitor.findByPk(req.params.id);

      if (!leitor) {

        return res.status(404).json({
          erro: 'Leitor não encontrado.'
        });

      }

      await leitor.update(req.body);

      return res.json({
        mensagem: 'Leitor atualizado com sucesso.',
        leitor
      });

    } catch (error) {

      return res.status(500).json({
        erro: error.message
      });

    }

  },

  // ==========================
  // Inativar Leitor
  // ==========================
  inativar: async (req, res) => {

    try {

      const leitor = await Leitor.findByPk(req.params.id);

      if (!leitor) {

        return res.status(404).json({
          erro: 'Leitor não encontrado.'
        });

      }

      await leitor.update({
        status: 'inativo'
      });

      return res.json({
        mensagem: 'Leitor inativado com sucesso.'
      });

    } catch (error) {

      return res.status(500).json({
        erro: error.message
      });

    }

  },

  // ==========================
  // Buscar por Nome ou CPF
  // ==========================
  search: async (req, res) => {

    try {

      const { nome, cpf } = req.query;

      const where = {};

      if (nome) {

        where.nome = {
          [Op.iLike]: `%${nome}%`
        };

      }

      if (cpf) {

        where.cpf_ra = {
          [Op.iLike]: `%${cpf}%`
        };

      }

      const leitores = await Leitor.findAll({
        where
      });

      return res.json(leitores);

    } catch (error) {

      return res.status(500).json({
        erro: error.message
      });

    }

  },

  // ==========================
  // Histórico
  // ==========================
  historico: async (req, res) => {

    try {

      const historico = await Emprestimo.findAll({
        where: {
          leitorId: req.params.id
        }
      });

      return res.json(historico);

    } catch (error) {

      return res.status(500).json({
        erro: error.message
      });

    }

  }

};

module.exports = LeitorController;