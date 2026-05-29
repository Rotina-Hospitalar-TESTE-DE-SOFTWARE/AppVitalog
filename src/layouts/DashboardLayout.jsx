import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  LayoutDashboard, 
  Activity, 
  Droplet, 
  History as HistoryIcon, 
  LogOut, 
  Menu, 
  X,
  ShieldAlert
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navItems = [
    { path: '/dashboard', label: 'Painel Geral', icon: LayoutDashboard },
    { path: '/blood-pressure', label: 'Pressão Arterial', icon: Activity },
    { path: '/glucose', label: 'Glicemia', icon: Droplet },
    { path: '/history', label: 'Histórico', icon: HistoryIcon },
  ];

  return (
    <div className="dashboard-container">
      {/* Botão Mobile Hamburger */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay para fechar sidebar no clique em mobile */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar de Navegação */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">
            <HeartPulse size={24} />
          </div>
          <span className="brand-name">Vitalog</span>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div>
              <div className="user-name">{user?.name || 'Administrador'}</div>
              <div className="user-role">Paciente</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', minHeight: '48px', fontSize: '1.05rem', fontWeight: '700' }}>
            <LogOut size={18} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Área Principal de Conteúdo */}
      <main className="main-content">
        {children}
        <div className="medical-disclaimer-bar animate-fade-in">
          <ShieldAlert size={24} className="disclaimer-icon" />
          <p>O sistema é um registro de apoio e não substitui a avaliação clínica profissional de um médico.</p>
        </div>
      </main>

      {/* Estilos inline adicionais para lidar com o comportamento do menu mobile que escapam do layout.css */}
      <style dangerouslySetInnerHTML={{__html: `
        .mobile-menu-btn {
          display: none;
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1010;
          background: var(--surface-color);
          border: 1px solid var(--surface-border);
          color: var(--text-primary);
          padding: 8px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          backdrop-filter: var(--glass-blur);
        }
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99;
          backdrop-filter: blur(4px);
        }
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .sidebar-overlay {
            display: block;
          }
        }
      `}} />
    </div>
  );
};

export default DashboardLayout;
