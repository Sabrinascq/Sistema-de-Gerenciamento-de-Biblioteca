// controllers/AuthController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthController = {
  // Registro de novos usuários (Geralmente feito por um Administrador)
  register: async (req, res) => {
    try {
      const { nome, email, senha, tipo } = req.body;

      // Validação básica do perfil exigido no PDF
      if (!['Administrador', 'Bibliotecario', 'Leitor'].includes(tipo)) {
        return res.status(400).json({ erro: 'Tipo de usuário inválido.' });
      }

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ erro: 'E-mail já cadastrado.' });
      }

      const newUser = await User.create({ nome, email, senha, tipo });
      
      // Retorna o usuário sem a senha por segurança
      return res.status(201).json({
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
        tipo: newUser.tipo
      });
    } catch (error) {
      return res.status(500).json({ erro: 'Erro interno ao registrar usuário.' });
    }
  },

  // Login do sistema gerando o token JWT
  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ erro: 'Credenciais inválidas.' });
      }

      const isMatch = await bcrypt.compare(senha, user.senha);
      if (!isMatch) {
        return res.status(401).json({ erro: 'Credenciais inválidas.' });
      }

      // Gera o token contendo o ID e o Tipo (Perfil) do usuário para validação das rotas
      const token = jwt.sign(
        { id: user.id, tipo: user.tipo },
        process.env.JWT_SECRET || 'chave_secreta_padrao_caso_env_falhe',
        { expiresIn: '1d' }
      );

      return res.json({
        mensagem: 'Login efetuado com sucesso!',
        token,
        user: { id: user.id, nome: user.nome, tipo: user.tipo }
      });
    } catch (error) {
      return res.status(500).json({ erro: 'Erro interno ao realizar login.' });
    }
  }
};

module.exports = AuthController;