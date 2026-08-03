import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PreTestResult: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        if (location.state && location.state.score !== undefined) {
            setScore(location.state.score);
        }
    }, [location]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6', padding: '1rem' }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', backgroundColor: score > 50 ? '#ECFDF5' : '#FEF2F2', color: score > 50 ? '#10B981' : '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={40} />
                </div>
                
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                    Pre-Test Selesai!
                </h1>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>
                    Terima kasih telah menyelesaikan Pre-Test Kompetensi. Berikut adalah estimasi kemampuan awal Anda.
                </p>

                <div style={{ padding: '2rem', backgroundColor: '#F9FAFB', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Skor Akhir</div>
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: score >= 70 ? '#10B981' : (score >= 40 ? '#F59E0B' : '#EF4444') }}>
                        {Math.round(score)}%
                    </div>
                </div>

                <button 
                    onClick={() => { window.location.href = '/'; }} 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                >
                    <LayoutDashboard size={20} /> Masuk ke Ruang Kerja Magang
                </button>
            </div>
        </div>
    );
};

export default PreTestResult;
