// app.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/authRoutes');
const livroRoutes = require('./routes/livroRoutes');
const leitorRoutes = require('./routes/leitorRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');
const emprestimoRoutes = require('./routes/emprestimoRoutes');

// --- IMPORTAÇÕES DO SWAGGER ATUALIZADAS ---
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Aponta para o arquivo JSON criado

const app = express();

// --- ROTA DO SWAGGER ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());

// Rotas da Aplicação
app.use('/api/auth', authRoutes);
app.use('/api/livros', livroRoutes);
app.use('/api/leitores', leitorRoutes);
app.use('/api/emprestimos', emprestimoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/relatorios', relatorioRoutes);

app.get('/', (req, res) => {
  res.send('API da Biblioteca Rodando!');
});

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    return sequelize.sync({ alter: true });
  })
  .then(async () => {
    console.log('Tabelas do banco de dados sincronizadas.');

    // --- INÍCIO DA LÓGICA DO ADMIN PADRÃO ---
    try {
      const usuariosIniciais = [
        { nome: 'Administrador', email: 'admin@email.com', senha: '1234', tipo: 'Administrador' },
        { nome: 'Bibliotecário', email: 'bibliotecario@email.com', senha: '1234', tipo: 'Bibliotecário' },
        { nome: 'Leitor Um', email: 'leitor@email.com', senha: '1234', tipo: 'Leitor' },
        { nome: 'Leitor Dois', email: 'leitor2@email.com', senha: '1234', tipo: 'Leitor' }
      ];

      for (const usuario of usuariosIniciais) {
        // Verifica se o usuário já existe pelo e-mail
        const userExists = await User.findOne({ where: { email: usuario.email } });
        
        if (!userExists) {
          const hashedPassword = await bcrypt.hash(usuario.senha, 10);
          await User.create({
            nome: usuario.nome,
            email: usuario.email,
            senha: hashedPassword,
            tipo: usuario.tipo
          });
          console.log(`✅ Usuário padrão criado: ${usuario.tipo} [${usuario.email}]`);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao criar usuários padrão:', error);
    }
    // --- FIM DA LÓGICA DO ADMIN PADRÃO ---

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro crítico ao conectar ao banco de dados:', err.message);
  });