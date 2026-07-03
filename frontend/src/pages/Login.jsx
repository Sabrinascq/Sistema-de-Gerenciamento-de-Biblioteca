import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const resposta = await api.post('/auth/login', { email, senha });
      
      // Salva o token e os dados do usuário no navegador
      localStorage.setItem('token', resposta.data.token);
      localStorage.setItem('user', JSON.stringify(resposta.data.user));

      // Redireciona para a tela principal (Livros) após o login
      navigate('/livros');
    } catch (error) {
      // Exibe a mensagem de erro na própria tela, de forma elegante
      setErro(error.response?.data?.erro || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f4f6f9' }}>
      <div className="card border-0 shadow-lg" style={{ width: '100%', maxWidth: '420px', borderRadius: '1rem' }}>
        <div className="card-body p-5">
          
          {/* Cabeçalho do Login */}
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3 shadow" style={{ width: '64px', height: '64px', fontSize: '28px' }}>
              📚
            </div>
            <h3 className="fw-bold text-dark mb-1">Sistema Biblioteca</h3>
            <p className="text-muted small">Faça login para acessar o acervo</p>
          </div>

          {/* Alerta de Erro (Só aparece se a senha/email estiverem errados) */}
          {erro && (
            <div className="alert alert-danger py-2 small fw-semibold text-center border-0 rounded-3" role="alert">
              {erro}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleLogin}>
            
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control rounded-3"
                id="floatingInput"
                placeholder="nome@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="floatingInput" className="text-muted">E-mail de acesso</label>
            </div>

            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control rounded-3"
                id="floatingPassword"
                placeholder="Senha"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <label htmlFor="floatingPassword" className="text-muted">Senha</label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-3 fw-bold shadow-sm rounded-3"
              disabled={loading}
              style={{ transition: 'all 0.2s ease' }}
            >
              {loading ? 'Autenticando...' : 'Entrar no Sistema'}
            </button>
            
          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;