import { Routes, Route, Navigate } from "react-router-dom";

// Páginas
import Login from "./pages/Login";
import Livros from "./pages/Livros";
import Leitores from "./pages/Leitores";
import Emprestimos from "./pages/Emprestimos";
import Usuarios from "./pages/Usuarios";
import Relatorios from "./pages/Relatorios";

// Componentes de Layout e Segurança
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

// O Navbar antigo foi removido. 
// O novo Sidebar já envolve a tela inteira (Menu Esquerdo + Topo + Conteúdo)
const MainLayout = ({ children }) => (
  <Sidebar>
    {children}
  </Sidebar>
);

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />

            <Route path="/livros" element={
                <ProtectedRoute><MainLayout><Livros /></MainLayout></ProtectedRoute>
            } />

            <Route path="/leitores" element={
                <ProtectedRoute><MainLayout><Leitores /></MainLayout></ProtectedRoute>
            } />

            <Route path="/emprestimos" element={
                <ProtectedRoute><MainLayout><Emprestimos /></MainLayout></ProtectedRoute>
            } />

            <Route path="/usuarios" element={
                <ProtectedRoute><MainLayout><Usuarios /></MainLayout></ProtectedRoute>
            } />

            <Route path="/relatorios" element={
                <ProtectedRoute><MainLayout><Relatorios /></MainLayout></ProtectedRoute>
            } />
        </Routes>
    );
}

export default App;