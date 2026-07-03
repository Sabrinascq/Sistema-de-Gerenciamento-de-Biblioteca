const Emprestimo = require('../models/Emprestimo');
const Livro = require('../models/Livro');
const Leitor = require('../models/Leitor');
const User = require('../models/User');
const { Op } = require('sequelize');

const EmprestimoController = {

    // ====================================
    // Registrar Empréstimo Múltiplo
    // ====================================
    create: async (req, res) => {
        try {
            // Agora recebemos um array de livroIds
            const { leitorId, livroIds, data_emprestimo, data_prevista_devolucao } = req.body;

            const leitor = await Leitor.findByPk(leitorId);
            if (!leitor) return res.status(404).json({ erro: 'Leitor não encontrado.' });
            if (leitor.status === 'inativo') return res.status(400).json({ erro: 'Leitor inativo não pode realizar empréstimos.' });

            // Validação da lista de livros
            if (!livroIds || livroIds.length === 0) return res.status(400).json({ erro: 'Informe pelo menos um livro.' });

            const livros = await Livro.findAll({ where: { id: livroIds } });
            
            if (livros.length !== livroIds.length) {
                return res.status(404).json({ erro: 'Um ou mais livros não foram encontrados no sistema.' });
            }

            // Verifica o estoque de TODOS os livros antes de salvar
            for (const livro of livros) {
                if (livro.quantidade_disponivel <= 0) {
                    return res.status(400).json({ erro: `O livro '${livro.titulo}' está indisponível.` });
                }
            }

            // 1. Cria o "Cabeçalho" do empréstimo
            const emprestimo = await Emprestimo.create({
                leitorId,
                data_emprestimo: data_emprestimo || new Date(),
                data_prevista_devolucao,
                status: 'Em aberto' 
            });

            // 2. Salva todos os itens na tabela intermediária
            await emprestimo.addLivros(livros);

            // 3. Dá baixa no estoque de cada livro
            for (const livro of livros) {
                await livro.update({
                    quantidade_disponivel: livro.quantidade_disponivel - 1,
                    status: livro.quantidade_disponivel - 1 <= 0 ? 'indisponível' : 'disponível'
                });
            }

            return res.status(201).json({ mensagem: 'Empréstimo realizado com sucesso.', emprestimo });

        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const emprestimos = await Emprestimo.findAll({ include: [Livro, Leitor] });
            const hoje = new Date();

            for (const emp of emprestimos) {
                if (emp.status === 'Em aberto' && new Date(emp.data_prevista_devolucao) < hoje) {
                    await emp.update({ status: 'Atrasado' });
                }
            }
            const listaAtualizada = await Emprestimo.findAll({ include: [Livro, Leitor] });
            return res.json(listaAtualizada);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const emprestimo = await Emprestimo.findByPk(req.params.id, { include: [Livro, Leitor] });
            if (!emprestimo) return res.status(404).json({ erro: 'Empréstimo não encontrado.' });
            return res.json(emprestimo);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    // ====================================
    // Devolver (Todos os livros do Empréstimo)
    // ====================================
    devolver: async (req, res) => {
        try {
            // Puxa o empréstimo junto com a lista de Livros atrelada a ele
            const emprestimo = await Emprestimo.findByPk(req.params.id, { include: [Livro] });

            if (!emprestimo) return res.status(404).json({ erro: 'Empréstimo não encontrado.' });
            if (emprestimo.status === 'Devolvido') return res.status(400).json({ erro: 'Este empréstimo já foi devolvido.' });

            await emprestimo.update({
                data_real_devolucao: new Date(),
                status: 'Devolvido'
            });

            // Faz um loop para devolver o estoque de todos os livros atrelados
            if (emprestimo.Livros && emprestimo.Livros.length > 0) {
                for (const livro of emprestimo.Livros) {
                    await livro.update({
                        quantidade_disponivel: livro.quantidade_disponivel + 1,
                        status: 'disponível'
                    });
                }
            }

            return res.json({ mensagem: 'Devolução registrada com sucesso.', emprestimo });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    search: async (req, res) => {
        try {
            const { status, nome_leitor, data_emprestimo } = req.query;
            const where = {};
            const include = [{ model: Livro }];

            if (status) where.status = status;

            if (data_emprestimo) {
                const [ano, mes, dia] = data_emprestimo.split('-');
                const dataInicio = new Date(ano, mes - 1, dia, 0, 0, 0);
                const dataFim = new Date(ano, mes - 1, dia, 23, 59, 59, 999);
                where.data_emprestimo = { [Op.between]: [dataInicio, dataFim] };
            }

            const leitorInclude = { model: Leitor };
            if (nome_leitor) {
                leitorInclude.where = { nome: { [Op.iLike]: `%${nome_leitor}%` } };
            }
            include.push(leitorInclude);

            const emprestimos = await Emprestimo.findAll({ where, include });
            return res.json(emprestimos);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    meusEmprestimos: async (req, res) => {
        try {
            const user = await User.findByPk(req.user.id);
            const leitor = await Leitor.findOne({ where: { email: user.email } });
            if (!leitor) return res.json([]);

            const emprestimos = await Emprestimo.findAll({
                where: { leitorId: leitor.id },
                include: [Livro, Leitor]
            });
            return res.json(emprestimos);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }
};

module.exports = EmprestimoController;