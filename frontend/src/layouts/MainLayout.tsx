import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { CommandPalette } from '../components/layout/CommandPalette';

const MainLayout: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) setIsCollapsed(true);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Global shortcut listener
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(true);
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    return (
        <div className="app-workspace">
            {/* Command Palette Layer */}
            <CommandPalette 
                isOpen={isCommandPaletteOpen} 
                onClose={() => setIsCommandPaletteOpen(false)} 
            />

            {/* Sidebar */}
            <Sidebar 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
                isMobile={isMobile} 
            />

            {/* Main Content Area */}
            <div className="main-workspace">
                <Topbar 
                    isMobile={isMobile}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                />

                <div className="content-scroll-area">
                    <main className="content-container">
                        <Outlet />
                    </main>
                    <footer style={{ textAlign: 'center', padding: 'var(--space-24)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                        &copy; {new Date().getFullYear()} Pusat Sistem Informasi Manajemen (PUSIM). All rights reserved.
                    </footer>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isMobile && !isCollapsed && (
                <div 
                    style={{ position: 'fixed', inset: 0, zIndex: 30 }}
                    onClick={() => setIsCollapsed(true)}
                />
            )}
        </div>
    );
};

export default MainLayout;
