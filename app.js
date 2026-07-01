// app.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const livroRoutes = require('./routes/livroRoutes');
const app = express();
app.use(cors());
app.use(express.json());

// Rotas da Aplicação
app.use('/api/auth', authRoutes);
app.use('/api/livros', livroRoutes);

app.get('/', (req, res) => {
  res.send('API da Biblioteca Rodando!');
});

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Tabelas do banco de dados sincronizadas.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro crítico ao conectar ao banco de dados:', err.message);
  });