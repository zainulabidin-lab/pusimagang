import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Bell, Moon, Sun, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useLocation } from 'react-router-dom';

interface TopbarProps {
  isMobile: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  onOpenCommandPalette: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ isMobile, isCollapsed, setIsCollapsed, onOpenCommandPalette }) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const location = useLocation();
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      api.get('/notifications').then(res => setNotifications(res.data.data)).catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
    } catch (error) {
      console.error(error);
    }
  };

  // Generate simple breadcrumbs based on path
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <header className="topbar-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)' }}>
        {isMobile && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Menu size={24} />
          </button>
        )}

        {/* Breadcrumbs */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 'var(--font-size-button)', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-main)' }}>Home</span>
            {pathnames.map((name, index) => (
              <React.Fragment key={name}>
                <ChevronRight size={14} style={{ margin: '0 var(--space-4)' }} />
                <span style={{ textTransform: 'capitalize', color: index === pathnames.length - 1 ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: index === pathnames.length - 1 ? 'var(--font-weight-medium)' : 'normal' }}>
                  {name.replace('-', ' ')}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)' }}>
        
        {/* Command Palette Trigger */}
        <button 
          onClick={onOpenCommandPalette}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-48)', 
            padding: 'var(--space-8) var(--space-12)', 
            backgroundColor: 'var(--surface)', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            boxShadow: 'var(--shadow-very-soft)'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--text-muted)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
            <Search size={16} />
            <span style={{ fontSize: 'var(--font-size-caption)' }}>Search...</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <kbd style={{ backgroundColor: 'var(--background)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', border: '1px solid var(--border)' }}>Ctrl</kbd>
            <kbd style={{ backgroundColor: 'var(--background)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', border: '1px solid var(--border)' }}>K</kbd>
          </div>
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)' }}></div>

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            style={{ 
              position: 'relative', background: 'none', border: 'none', cursor: 'pointer', 
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              width: '36px', height: '36px', borderRadius: 'var(--radius-full)', transition: 'background-color var(--transition-fast)' 
            }} 
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'} 
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: 'var(--primary)', borderRadius: '50%', border: '2px solid var(--background)' }}></span>}
          </button>

          {showNotifications && (
            <div style={{ 
              position: 'absolute', top: '100%', right: '0', width: '340px', marginTop: 'var(--space-8)', 
              backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-dropdown)', 
              border: '1px solid var(--border)', zIndex: 'var(--z-dropdown)', overflow: 'hidden' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-16)', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
                <h3 style={{ fontSize: 'var(--font-size-button)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 'var(--font-size-caption)', cursor: 'pointer', fontWeight: 'var(--font-weight-medium)' }}>
                    Mark all read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: 'var(--space-32) var(--space-16)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--font-size-button)' }}>
                    All caught up!
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} style={{ padding: 'var(--space-16)', borderBottom: '1px solid var(--border)', backgroundColor: notif.is_read ? 'transparent' : 'rgba(15, 82, 186, 0.05)', cursor: 'pointer', transition: 'background-color var(--transition-fast)' }}>
                      <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: notif.is_read ? 'transparent' : 'var(--primary)', marginTop: '6px', flexShrink: 0 }}></div>
                        <div>
                          <h4 style={{ fontSize: 'var(--font-size-button)', fontWeight: 'var(--font-weight-semibold)', margin: '0 0 var(--space-4) 0', color: 'var(--text-main)' }}>{notif.title}</h4>
                          <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)', margin: '0 0 var(--space-8) 0', lineHeight: 1.4 }}>{notif.message}</p>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{new Date(notif.created_at).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)} 
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', cursor: 'pointer', background: 'none', border: 'none', padding: 'var(--space-4)', borderRadius: 'var(--radius-full)', transition: 'background-color var(--transition-fast)' }} 
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'} 
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            </div>
          </button>

          {showProfileMenu && (
            <div style={{ 
              position: 'absolute', top: '100%', right: '0', width: '220px', marginTop: 'var(--space-8)', 
              backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-dropdown)', 
              border: '1px solid var(--border)', zIndex: 'var(--z-dropdown)', overflow: 'hidden' 
            }}>
              <div style={{ padding: 'var(--space-16)', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
                <p style={{ margin: 0, fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-main)', fontSize: 'var(--font-size-button)' }}>{user?.name}</p>
                <p style={{ margin: 0, fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
              </div>
              <div style={{ padding: 'var(--space-8)' }}>
                <button style={{ width: '100%', textAlign: 'left', padding: 'var(--space-8) var(--space-12)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-8)', color: 'var(--text-main)', borderRadius: 'var(--radius-sm)', transition: 'background-color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <Settings size={16} /> <span style={{ fontSize: 'var(--font-size-button)' }}>Settings</span>
                </button>
                <button onClick={logout} style={{ width: '100%', textAlign: 'left', padding: 'var(--space-8) var(--space-12)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-8)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', transition: 'background-color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <LogOut size={16} /> <span style={{ fontSize: 'var(--font-size-button)' }}>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
