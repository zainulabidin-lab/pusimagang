import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Book, FileText, Download, Search, Folder } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const KnowledgeBase: React.FC = () => {
    const [categories, setCategories] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchKb = async () => {
            try {
                const response = await api.get('/knowledge-base');
                setCategories(response.data.data);
            } catch (error) {
                console.error('Failed to fetch KB', error);
            } finally {
                setLoading(false);
            }
        };
        fetchKb();
    }, []);

    const filteredCategories = Object.keys(categories).reduce((acc: any, category) => {
        const filteredDocs = categories[category].filter((doc: any) => 
            doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (doc.content && doc.content.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        if (filteredDocs.length > 0) {
            acc[category] = filteredDocs;
        }
        return acc;
    }, {});

    if (loading) return <LoadingSpinner message="Memuat Knowledge Base..." />;

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="page-title">Knowledge Base & SOP</h1>
                    <p className="page-subtitle">Pusat dokumentasi, panduan, dan standar operasional PUSIM.</p>
                </div>
                <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                        type="text" 
                        placeholder="Cari dokumen atau panduan..." 
                        className="input-control"
                        style={{ paddingLeft: '2.5rem', borderRadius: '999px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {Object.keys(filteredCategories).length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border)' }}>
                    <Book size={48} style={{ color: 'var(--border)', margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>Dokumen Tidak Ditemukan</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Coba gunakan kata kunci pencarian yang lain.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {Object.keys(filteredCategories).map(category => (
                        <div key={category} className="card" style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ padding: '0.75rem', backgroundColor: '#EFF6FF', color: '#2563EB', borderRadius: 'var(--radius-lg)' }}>
                                    <Folder size={24} />
                                </div>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, textTransform: 'capitalize' }}>{category}</h2>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {filteredCategories[category].map((doc: any) => (
                                    <div key={doc.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-md)', transition: 'all 0.2s', cursor: 'pointer' }} className="hover:bg-gray-50">
                                        <FileText size={20} style={{ color: 'var(--text-muted)', marginTop: '0.125rem' }} />
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{doc.title}</h4>
                                            {doc.content && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{doc.content}</p>}
                                        </div>
                                        {doc.file_path && (
                                            <a href={`/storage/${doc.file_path}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: 'var(--primary)', padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: '#EFF6FF' }}>
                                                <Download size={16} />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KnowledgeBase;
