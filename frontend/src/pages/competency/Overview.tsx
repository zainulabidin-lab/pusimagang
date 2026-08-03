import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Clock, Activity, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Overview: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const res = await api.get('/competency/overview');
                setStats(res.data.data);
            } catch (error) {
                console.error("Failed to fetch competency overview", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOverview();
    }, []);

    if (loading) return <LoadingSpinner message="Memuat Pusat Kompetensi..." />;

    if (stats?.role === 'admin' || stats?.role === 'mentor') {
        return (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Pusat Kompetensi (Admin/Mentor)</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Pantau perkembangan keahlian anak magang.</p>
                    </div>
                </div>

                <div className="card">
                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Users size={20} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Daftar Progres Anak Magang</h2>
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #E5E7EB', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '1rem', fontWeight: 500 }}>Nama Anak Magang</th>
                                    <th style={{ padding: '1rem', fontWeight: 500 }}>Rata-rata Penguasaan</th>
                                    <th style={{ padding: '1rem', fontWeight: 500 }}>XP Terkumpul</th>
                                    <th style={{ padding: '1rem', fontWeight: 500 }}>Modul Dipelajari</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.interns?.map((intern: any) => (
                                    <tr key={intern.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 500 }}>{intern.name}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{intern.email}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ flex: 1, height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden', minWidth: '100px' }}>
                                                    <div style={{ height: '100%', width: `${intern.average_mastery}%`, backgroundColor: 'var(--primary)' }} />
                                                </div>
                                                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{intern.average_mastery}%</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 600, color: '#10B981' }}>{intern.total_xp} XP</td>
                                        <td style={{ padding: '1rem' }}>{intern.modules_learned} Modul</td>
                                    </tr>
                                ))}
                                {(!stats.interns || stats.interns.length === 0) && (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            Belum ada data anak magang.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Pusat Kompetensi</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Pantau perkembangan keahlian dan roadmap belajarmu.</p>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', backgroundColor: '#EFF6FF', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
                            <Award size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Rata-rata Penguasaan</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats?.average_mastery || 0}%</div>
                        </div>
                    </div>
                </div>
                
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', backgroundColor: '#ECFDF5', color: '#10B981', borderRadius: 'var(--radius-md)' }}>
                            <Activity size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>XP Terkumpul</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats?.total_xp || 0}</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', backgroundColor: '#FEF2F2', color: '#EF4444', borderRadius: 'var(--radius-md)' }}>
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Modul Dipelajari</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats?.modules_learned || 0}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                    <Clock size={40} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Integrasi Sedang Berlangsung</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>Modul Pusat Kompetensi V2.0 saat ini sedang dalam tahap pengembangan dan migrasi data dari ExamHub.</p>
            </div>
        </div>
    );
};

export default Overview;
