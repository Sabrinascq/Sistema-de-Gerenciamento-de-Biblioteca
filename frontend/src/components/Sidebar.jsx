import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ children }) => {
  // Busca as informações do usuário logado e prepara navegação
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  const navigate = useNavigate();

  // Define as permissões baseadas no perfil (Mantidas do seu código original)
  const isAdmin = user?.tipo === 'Administrador';
  const podeGerenciar = user?.tipo === 'Administrador' || user?.tipo === 'Bibliotecário';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Classes dinâmicas do Bootstrap para os links do menu
  const linkClass = (path) => {
    return `nav-link text-white fw-semibold mb-1 ${location.pathname === path ? 'active shadow-sm' : 'opacity-75'}`;
  };

  return (
    <div className="d-flex vh-100" style={{ overflow: 'hidden' }}>
      
      {/* MENU LATERAL (ESQUERDA) */}
      <aside className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark shadow" style={{ width: '260px', zIndex: 1000 }}>
        <div className="d-flex align-items-center mb-4 mt-2 px-2 text-white text-decoration-none">
          <span className="fs-5 fw-bold text-uppercase tracking-wide text-primary">📚 Biblioteca</span>
        </div>
        <hr className="text-secondary mt-0" />

        <ul className="nav nav-pills flex-column mb-auto gap-1">
          <li className="nav-item">
            <Link to="/livros" className={linkClass('/livros')}>📖 Livros</Link>
          </li>
          
          {podeGerenciar && (
            <li className="nav-item">
              <Link to="/leitores" className={linkClass('/leitores')}>👥 Leitores</Link>
            </li>
          )}

          <li className="nav-item">
            <Link to="/emprestimos" className={linkClass('/emprestimos')}>🤝 Empréstimos</Link>
          </li>

          {isAdmin && (
            <>
              <hr className="text-secondary my-2" />
              <small className="text-muted text-uppercase px-3 fw-bold mb-2" style={{ fontSize: '11px' }}>Administração</small>
              <li className="nav-item">
                <Link to="/usuarios" className={linkClass('/usuarios')}>⚙️ Usuários</Link>
              </li>
              <li className="nav-item">
                <Link to="/relatorios" className={linkClass('/relatorios')}>📊 Relatórios</Link>
              </li>
            </>
          )}
        </ul>
      </aside>

      {/* ÁREA PRINCIPAL DA DIREITA (TOPO + CONTEÚDO) */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflowY: 'auto', backgroundColor: '#f4f6f8' }}>
        
        {/* TOPO FLUTUANTE */}
        <header className="px-4 py-3 bg-white border-bottom shadow-sm d-flex justify-content-between align-items-center sticky-top">
          <h5 className="mb-0 text-muted fw-bold">Painel de Controle</h5>
          <div className="d-flex align-items-center gap-3">
            <span className="text-secondary">
              Olá, <strong className="text-dark">{user?.nome || 'Usuário'}</strong>
              <span className="badge bg-primary ms-2">{user?.tipo}</span>
            </span>
            <button onClick={handleLogout} className="btn btn-sm btn-outline-danger fw-bold px-3 shadow-sm">
              Sair
            </button>
          </div>
        </header>

        {/* CONTEÚDO DA TELA ATUAL */}
        <main className="p-4">
          {children}
        </main>
      </div>
      
    </div>
  );
};

export default Sidebar;