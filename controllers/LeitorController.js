const Leitor = require('../models/Leitor');

const LeitorController = {
  create: async (req, res) => {
    try {
      const leitor = await Leitor.create(req.body);
      return res.status(201).json(leitor);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao cadastrar leitor.' });
    }
  },
  getAll: async (req, res) => {
    try {
      const leitores = await Leitor.findAll();
      return res.status(200).json(leitores);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao buscar leitores.' });
    }
  }
};

module.exports = LeitorController;
