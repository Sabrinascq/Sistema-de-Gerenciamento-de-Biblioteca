const Emprestimo = require('../models/Emprestimo');
const Livro = require('../models/Livro');
const Leitor = require('../models/Leitor');

const EmprestimoController = {

    // ====================================
    // Registrar Empréstimo
    // ====================================
    create: async (req, res) => {

        try {

            const { leitorId, livroId, data_prevista_devolucao } = req.body;

            const leitor = await Leitor.findByPk(leitorId);

            if (!leitor) {
                return res.status(404).json({
                    erro: 'Leitor não encontrado.'
                });
            }

            if (leitor.status === 'inativo') {
                return res.status(400).json({
                    erro: 'Leitor inativo não pode realizar empréstimos.'
                });
            }

            const livro = await Livro.findByPk(livroId);

            if (!livro) {
                return res.status(404).json({
                    erro: 'Livro não encontrado.'
                });
            }

            if (livro.quantidade_disponivel <= 0) {
                return res.status(400).json({
                    erro: 'Livro indisponível.'
                });
            }

            const emprestimo = await Emprestimo.create({
                leitorId,
                livroId,
                data_prevista_devolucao
            });

            await livro.update({
                quantidade_disponivel: livro.quantidade_disponivel - 1,
                status:
                    livro.quantidade_disponivel - 1 <= 0
                        ? 'indisponível'
                        : 'disponível'
            });

            return res.status(201).json({
                mensagem: 'Empréstimo realizado com sucesso.',
                emprestimo
            });

        } catch (error) {

            return res.status(500).json({
                erro: error.message
            });

        }

    },

    // ====================================
    // Listar Empréstimos
    // ====================================
    getAll: async (req, res) => {

        try {

            const emprestimos = await Emprestimo.findAll({
                include: [Livro, Leitor]
            });

            const hoje = new Date();

            for (const emprestimo of emprestimos) {

                if (
                    emprestimo.status === 'aberto' &&
                    new Date(emprestimo.data_prevista_devolucao) < hoje
                ) {

                    await emprestimo.update({
                        status: 'atrasado'
                    });

                }

            }

            const listaAtualizada = await Emprestimo.findAll({
                include: [Livro, Leitor]
            });

            return res.json(listaAtualizada);

        } catch (error) {

            return res.status(500).json({
                erro: error.message
            });

        }

    },

    // ====================================
    // Buscar Empréstimo por ID
    // ====================================
    getById: async (req, res) => {

        try {

            const emprestimo = await Emprestimo.findByPk(req.params.id, {
                include: [Livro, Leitor]
            });

            if (!emprestimo) {

                return res.status(404).json({
                    erro: 'Empréstimo não encontrado.'
                });

            }

            return res.json(emprestimo);

        } catch (error) {

            return res.status(500).json({
                erro: error.message
            });

        }

    },

    // ====================================
    // Registrar Devolução
    // ====================================
    devolver: async (req, res) => {

        try {

            const emprestimo = await Emprestimo.findByPk(req.params.id);

            if (!emprestimo) {

                return res.status(404).json({
                    erro: 'Empréstimo não encontrado.'
                });

            }

            if (emprestimo.status === 'devolvido') {

                return res.status(400).json({
                    erro: 'Este empréstimo já foi devolvido.'
                });

            }

            const livro = await Livro.findByPk(emprestimo.livroId);

            await emprestimo.update({
                data_real_devolucao: new Date(),
                status: 'devolvido'
            });

            await livro.update({
                quantidade_disponivel: livro.quantidade_disponivel + 1,
                status: 'disponível'
            });

            return res.json({
                mensagem: 'Devolução registrada com sucesso.'
            });

        } catch (error) {

            return res.status(500).json({
                erro: error.message
            });

        }

    },

    // ====================================
    // Buscar por Status
    // ====================================
    search: async (req, res) => {

        try {

            const { status } = req.query;

            const where = {};

            if (status) {

                where.status = status;

            }

            const emprestimos = await Emprestimo.findAll({
                where,
                include: [Livro, Leitor]
            });

            return res.json(emprestimos);

        } catch (error) {

            return res.status(500).json({
                erro: error.message
            });

        }

    }

};

module.exports = EmprestimoController;