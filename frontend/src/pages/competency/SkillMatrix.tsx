import React, { useState, useEffect } from 'react';
import { Target, Activity } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const SkillMatrix: React.FC = () => {
    const [matrix, setMatrix] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatrix = async () => {
            try {
                const res = await api.get('/competency/skill-matrix');
                setMatrix(res.data.data);
            } catch (err) {
                console.error("Failed to load skill matrix", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMatrix();
    }, []);

    if (loading) return <LoadingSpinner message="Memuat Skill Matrix..." />;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Skill Matrix</h1>
                <p style={{ color: 'var(--text-muted)' }}>Pantau persentase penguasaan kompetensi dan total XP yang Anda kumpulkan di setiap modul.</p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {matrix.map(skill => (
                    <div key={skill.competency_id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '1rem', backgroundColor: '#EFF6FF', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
                                <Target size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>{skill.competency_name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#D97706', fontWeight: 600 }}>
                                    <Activity size={16} /> {skill.xp} XP
                                </div>
                            </div>
                        </div>

                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1 }}>
                            {skill.description || 'Kompetensi teknis yang diperlukan untuk mendukung penyelesaian tugas.'}
                        </p>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                <span>Penguasaan</span>
                                <span style={{ color: skill.mastery_percentage >= 70 ? '#10B981' : 'var(--text-main)' }}>
                                    {Math.round(skill.mastery_percentage)}%
                                </span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                                <div 
                                    style={{ 
                                        height: '100%', 
                                        width: `${skill.mastery_percentage}%`, 
                                        backgroundColor: skill.mastery_percentage >= 70 ? '#10B981' : 'var(--primary)',
                                        transition: 'width 1s ease-in-out'
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {matrix.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Belum ada data kompetensi yang tersedia di sistem.
                </div>
            )}
        </div>
    );
};

export default SkillMatrix;
