import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, CheckSquare, BookOpen, Clock, Settings, FileText, User } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMANDS = [
  { id: 'dashboard', title: 'Go to Dashboard', icon: <LayoutDashboard size={16} />, path: '/' },
  { id: 'tasks', title: 'Go to Task Board', icon: <CheckSquare size={16} />, path: '/tasks' },
  { id: 'logbook', title: 'Go to Logbook', icon: <BookOpen size={16} />, path: '/logbook' },
  { id: 'history', title: 'Go to History', icon: <Clock size={16} />, path: '/history' },
  { id: 'sop', title: 'SOP Management', icon: <FileText size={16} />, path: '/sop-management' },
  { id: 'profile', title: 'View Profile', icon: <User size={16} />, path: '/profile' },
  { id: 'settings', title: 'Settings', icon: <Settings size={16} />, path: '/settings' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          navigate(filteredCommands[selectedIndex].path);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: 'var(--space-16)', borderBottom: '1px solid var(--border)' }}>
          <Input
            ref={inputRef}
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            leftIcon={<Search size={18} />}
            style={{ 
              border: 'none', 
              boxShadow: 'none', 
              backgroundColor: 'transparent',
              fontSize: 'var(--font-size-body)',
              paddingLeft: 'var(--space-48)'
            }}
          />
        </div>
        
        <div style={{ padding: 'var(--space-8)', maxHeight: '300px', overflowY: 'auto' }}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: 'var(--space-32)', textAlign: 'center', color: 'var(--text-muted)' }}>
              No results found for "{query}"
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)', padding: 'var(--space-8) var(--space-12)', fontWeight: 'var(--font-weight-medium)' }}>
                Suggestions
              </div>
              {filteredCommands.map((cmd, index) => (
                <button
                  key={cmd.id}
                  onClick={() => {
                    navigate(cmd.path);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-12)',
                    padding: 'var(--space-12) var(--space-16)',
                    width: '100%',
                    background: index === selectedIndex ? 'var(--surface-hover)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: index === selectedIndex ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: index === selectedIndex ? 'var(--font-weight-medium)' : 'normal',
                    transition: 'background-color var(--transition-fast)'
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span style={{ color: index === selectedIndex ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {cmd.icon}
                  </span>
                  <span>{cmd.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
