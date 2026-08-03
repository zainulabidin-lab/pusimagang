import React, { useState, useEffect } from 'react';
import { BookOpen, Video, FileText, ExternalLink, Compass } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const LearningPath: React.FC = () => {
    const [competencies, setCompetencies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLearningPaths = async () => {
            try {
                const res = await api.get('/competency/learning-paths');
                setCompetencies(res.data.data);
            } catch (err) {
                console.error("Failed to load learning paths", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLearningPaths();
    }, []);

    if (loading) return <LoadingSpinner message="Menyiapkan roadmap belajar..." />;

    const renderIcon = (type: string) => {
        switch (type) {
            case 'video': return <Video size={16} />;
            case 'article': return <FileText size={16} />;
            default: return <BookOpen size={16} />;
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Learning Path</h1>
                <p style={{ color: 'var(--text-muted)' }}>Materi pembelajaran yang disusun khusus untuk membantu Anda menguasai kompetensi.</p>
            </div>

            {competencies.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'white', borderRadius: 'var(--radius-lg)' }}>
                    Belum ada roadmap yang tersedia.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {competencies.map(comp => (
                        <div key={comp.id}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                                <Compass size={24} /> {comp.name}
                            </h2>
                            
                            {comp.learning_paths && comp.learning_paths.length > 0 ? (
                                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    {comp.learning_paths.map((lp: any) => (
                                        <div key={lp.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{lp.title}</h3>
                                            {lp.description && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{lp.description}</p>}
                                            
                                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#9CA3AF' }}>Materi Tersedia</div>
                                                {lp.items && lp.items.length > 0 ? lp.items.map((item: any) => (
                                                    <a 
                                                        key={item.id} 
                                                        href={item.url} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        style={{ 
                                                            display: 'flex', alignItems: 'center', gap: '0.75rem', 
                                                            padding: '0.75rem', backgroundColor: '#F9FAFB', 
                                                            borderRadius: 'var(--radius-md)', textDecoration: 'none',
                                                            color: 'var(--text-main)', border: '1px solid var(--border)',
                                                            transition: 'border-color 0.2s, background-color 0.2s'
                                                        }}
                                                        className="hover-border-primary"
                                                    >
                                                        <div style={{ color: 'var(--primary)' }}>
                                                            {renderIcon(item.item_type)}
                                                        </div>
                                                        <div style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                                                            {item.title}
                                                        </div>
                                                        <ExternalLink size={14} color="#9CA3AF" />
                                                    </a>
                                                )) : (
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Belum ada materi untuk sub-topik ini.</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', padding: '1.5rem', backgroundColor: '#F9FAFB', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
                                    Materi untuk kompetensi ini sedang disiapkan oleh pembimbing.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LearningPath;
