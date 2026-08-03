import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  Clock, 
  Book, 
  Award, 
  Network, 
  PanelLeftClose, 
  PanelLeftOpen, 
  FileText,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobile: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, isMobile }) => {
  const { user, logout } = useAuth();

  const navItemStyle = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    gap: isCollapsed ? '0' : 'var(--space-12)',
    padding: 'var(--space-8) var(--space-12)',
    borderRadius: 'var(--radius-md)',
    textDecoration: 'none',
    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
    backgroundColor: isActive ? 'rgba(15, 82, 186, 0.05)' : 'transparent',
    fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
    fontSize: 'var(--font-size-button)',
    marginBottom: 'var(--space-4)',
    transition: 'all var(--transition-fast)',
    position: 'relative' as const,
  });

  return (
    <aside 
      className={`sidebar-wrapper ${isMobile ? 'is-mobile' : ''}`}
      style={{ width: isCollapsed ? (isMobile ? '0px' : '96px') : '280px' }}
    >
      <div className="sidebar-container">
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isCollapsed ? 'center' : 'flex-start', 
          height: '80px', 
          padding: isCollapsed ? '0' : '0 var(--space-24)', 
          gap: 'var(--space-12)',
          flexShrink: 0
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '36px', 
            height: '36px', 
            backgroundColor: 'var(--primary)', 
            color: '#FFFFFF', 
            borderRadius: 'var(--radius-md)', 
            boxShadow: 'var(--shadow-soft)',
            flexShrink: 0
          }}>
            <Network size={20} strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-title)', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              PUSIM Magang
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ 
          padding: isCollapsed ? 'var(--space-16) var(--space-12)' : 'var(--space-16) var(--space-24)', 
          flex: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'var(--space-2)' 
        }}>
          
          {/* Main Menu */}
          <div style={{ marginBottom: 'var(--space-16)' }}>
            <NavLink to="/" style={({isActive}) => navItemStyle(isActive)} end title="Dashboard">
              <LayoutDashboard size={20} />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
            <NavLink to="/tasks" style={({isActive}) => navItemStyle(isActive)} title="Task Board">
              <CheckSquare size={20} />
              {!isCollapsed && <span>Task Board</span>}
            </NavLink>
            <NavLink to="/logbook" style={({isActive}) => navItemStyle(isActive)} title="Logbook Harian">
              <BookOpen size={20} />
              {!isCollapsed && <span>Logbook Harian</span>}
            </NavLink>
            <NavLink to="/history" style={({isActive}) => navItemStyle(isActive)} title="Riwayat">
              <Clock size={20} />
              {!isCollapsed && <span>Riwayat</span>}
            </NavLink>
          </div>

          {/* Academic Section */}
          <div style={{ 
            marginBottom: 'var(--space-8)', 
            fontSize: 'var(--font-size-caption)', 
            fontWeight: 'var(--font-weight-semibold)', 
            color: 'var(--text-muted)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            textAlign: isCollapsed ? 'center' : 'left',
            padding: isCollapsed ? '0' : '0 var(--space-12)'
          }}>
            {!isCollapsed ? 'Akademik' : '•••'}
          </div>
          <NavLink to="/knowledge-base" style={({isActive}) => navItemStyle(isActive)} title="Knowledge Base">
            <Book size={20} />
            {!isCollapsed && <span>Knowledge Base</span>}
          </NavLink>
          <NavLink to="/evaluations" style={({isActive}) => navItemStyle(isActive)} title="Penilaian Akhir">
            <Award size={20} />
            {!isCollapsed && <span>Penilaian Akhir</span>}
          </NavLink>
          
          {/* Admin Section */}
          {user?.role !== 'intern' && (
            <>
              <div style={{ 
                marginTop: 'var(--space-16)',
                marginBottom: 'var(--space-8)', 
                fontSize: 'var(--font-size-caption)', 
                fontWeight: 'var(--font-weight-semibold)', 
                color: 'var(--text-muted)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                textAlign: isCollapsed ? 'center' : 'left',
                padding: isCollapsed ? '0' : '0 var(--space-12)'
              }}>
                {!isCollapsed ? 'Manajemen' : '•••'}
              </div>
              <NavLink to="/sop-management" style={({isActive}) => navItemStyle(isActive)} title="SOP Management">
                <FileText size={20} />
                {!isCollapsed && <span>SOP Management</span>}
              </NavLink>
            </>
          )}

        </nav>

        {/* Footer Actions */}
        <div style={{ padding: 'var(--space-16)', borderTop: 'var(--border-width-sm) solid var(--border)' }}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-12)', 
              width: '100%', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              padding: 'var(--space-8) var(--space-12)', 
              borderRadius: 'var(--radius-md)', 
              color: 'var(--text-muted)', 
              justifyContent: isCollapsed ? 'center' : 'flex-start', 
              transition: 'background-color var(--transition-fast)' 
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Toggle Sidebar"
          >
            {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            {!isCollapsed && <span style={{ fontSize: 'var(--font-size-button)', fontWeight: 'var(--font-weight-medium)' }}>Collapse</span>}
          </button>
        </div>
        {/* User Profile Mini */}
        <div style={{ 
          padding: 'var(--space-16)', 
          borderTop: 'var(--border-width-sm) solid var(--border)',
          backgroundColor: 'var(--background)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: isCollapsed ? 'center' : 'space-between',
            gap: 'var(--space-12)'
          }}>
            {!isCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', overflow: 'hidden' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ margin: 0, fontSize: 'var(--font-size-button)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name}</p>
                  <p style={{ margin: 0, fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
