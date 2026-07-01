const jwt = require('jsonwebtoken');

const auth = (roles = []) => {

    return (req, res, next) => {

        try {

            const authHeader = req.header('Authorization');

            if (!authHeader) {

                return res.status(401).json({
                    erro: 'Token não informado.'
                });

            }

            const token = authHeader.replace('Bearer ', '');

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'chave_secreta_padrao_caso_env_falhe'
            );

            req.user = decoded;

            if (roles.length > 0 && !roles.includes(decoded.tipo)) {

                return res.status(403).json({
                    erro: 'Você não possui permissão para acessar este recurso.'
                });

            }

            next();

        } catch (error) {

            return res.status(401).json({
                erro: 'Token inválido ou expirado.'
            });

        }

    };

};

module.exports = auth;