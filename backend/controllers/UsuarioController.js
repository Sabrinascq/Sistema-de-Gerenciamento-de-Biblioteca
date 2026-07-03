const User = require('../models/User');
const bcrypt = require('bcrypt'); // Usado caso o admin queira mudar a senha de alguém

const UsuarioController = {

  // Criar um novo usuário
  create: async (req, res) => {
    try {
      const { nome, email, senha, tipo } = req.body;

      // 1. Validação básica
      if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
      }

      // 2. Valida se o tipo é permitido
      if (!['Administrador', 'Bibliotecário', 'Leitor'].includes(tipo)) {
        return res.status(400).json({ erro: 'Tipo de usuário inválido.' });
      }

      // 3. Verifica se o e-mail já está em uso
      const usuarioExistente = await User.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({ erro: 'Este e-mail já está cadastrado.' });
      }

      // 4. Criptografa a senha
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(senha, salt);

      // 5. Salva no banco de dados
      const novoUsuario = await User.create({
        nome,
        email,
        senha: senhaHash,
        tipo
      });

      // 6. Retorna sucesso (ocultando a senha)
      const usuarioRetorno = novoUsuario.toJSON();
      delete usuarioRetorno.senha;

      return res.status(201).json({ 
        mensagem: 'Usuário criado com sucesso!', 
        usuario: usuarioRetorno 
      });

    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },
  // Listar todos os usuários (Ocultando as senhas por segurança)
  getAll: async (req, res) => {
    try {
      const usuarios = await User.findAll({
        attributes: { exclude: ['senha'] } // Nunca retornar a hash da senha
      });
      return res.json(usuarios);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // Editar um usuário existente
  update: async (req, res) => {
    try {
      const { nome, email, senha, tipo } = req.body;
      const usuario = await User.findByPk(req.params.id);

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      // Valida o tipo se ele foi enviado
      if (tipo && !['Administrador', 'Bibliotecário', 'Leitor'].includes(tipo)) {
        return res.status(400).json({ erro: 'Tipo de usuário inválido.' });
      }

      // Prepara os dados para atualizar
      const dadosAtualizados = { nome, email, tipo };

      // Se o admin enviou uma nova senha, criptografa antes de salvar
      if (senha && senha.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        dadosAtualizados.senha = await bcrypt.hash(senha, salt);
      }

      await usuario.update(dadosAtualizados);

      return res.json({ mensagem: 'Usuário atualizado com sucesso!' });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // Excluir um usuário
  delete: async (req, res) => {
    try {
      const usuario = await User.findByPk(req.params.id);

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      // Trava de segurança: Evita que o usuário logado exclua a si mesmo
      if (usuario.id === req.user.id) {
        return res.status(403).json({ erro: 'Você não pode excluir sua própria conta.' });
      }

      await usuario.destroy();
      return res.json({ mensagem: 'Usuário excluído com sucesso!' });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }
};

module.exports = UsuarioController;