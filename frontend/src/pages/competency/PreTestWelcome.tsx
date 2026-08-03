import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PreTestWelcome: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6', padding: '1rem' }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', backgroundColor: '#EFF6FF', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={40} />
                </div>
                
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                    Selamat Datang di PUSIM Magang, {user?.name}!
                </h1>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.5', marginBottom: '2rem' }}>
                    Sebelum Anda memulai perjalanan magang dan menerima tugas pertama, Anda diwajibkan untuk mengikuti <strong>Pre-Test Kompetensi</strong>.
                </p>

                <div style={{ textAlign: 'left', backgroundColor: '#FEF2F2', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid #FECACA' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B91C1C', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                        <AlertTriangle size={20} />
                        Instruksi Penting
                    </h3>
                    <ul style={{ paddingLeft: '1.5rem', margin: 0, color: '#991B1B', fontSize: '0.875rem', lineHeight: '1.75' }}>
                        <li>Pre-Test terdiri dari <strong>10 pertanyaan</strong> pilihan ganda.</li>
                        <li>Waktu pengerjaan bebas (tidak dibatasi waktu).</li>
                        <li>Pre-Test hanya dapat dilakukan <strong>satu kali</strong>.</li>
                        <li>Nilai Pre-Test tidak menentukan kelulusan magang Anda, melainkan hanya digunakan untuk mengukur tingkat kemampuan awal agar sistem dapat memberikan rekomendasi tugas yang sesuai.</li>
                        <li>Kerjakan dengan jujur dan sebaik-baiknya.</li>
                    </ul>
                </div>

                <button 
                    onClick={() => navigate('/competency/pre-test/session')} 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                >
                    Mulai Ujian Sekarang <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default PreTestWelcome;
