import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    // Limpa o armazenamento local para deslogar
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redireciona para o login
    navigate('/');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: '#0056b3', color: 'white' }}>
      <h2 style={{ margin: 0 }}>Sistema de Biblioteca</h2>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>Olá, {user ? user.nome : 'Usuário'}</span>
        <button 
          onClick={handleLogout} 
          style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Sair
        </button>
      </div>
    </nav>
  );
};

export default Navbar;