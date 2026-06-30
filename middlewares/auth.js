const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      
      if (roles.length && !roles.includes(req.user.tipo)) {
        return res.status(403).json({ erro: 'Acesso restrito ao seu perfil.' });
      }

      next();
    } catch (ex) {
      res.status(400).json({ erro: 'Token inválido.' });
    }
  };
};

module.exports = auth;