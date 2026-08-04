import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Clock, Plus, Check, MessageCircle, FileText, AlertCircle, Activity } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';

const ActivityFeed: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/activity-feed');
                setLogs(response.data.data);
            } catch (error) {
                console.error("Failed to fetch activity feed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'created': return <Plus size={16} color="#3B82F6" />;
            case 'checklist_checked': return <Check size={16} color="#10B981" />;
            case 'review_requested': return <MessageCircle size={16} color="#F59E0B" />;
            case 'revised': return <AlertCircle size={16} color="#EF4444" />;
            case 'approved': return <Check size={16} color="#10B981" />;
            case 'moved': return <FileText size={16} color="#6366F1" />;
            default: return <Clock size={16} color="#6B7280" />;
        }
    };

    const formatActionText = (log: any) => {
        const name = log.user?.name || 'Sistem';
        const taskName = log.task?.title || 'Task';
        switch (log.action) {
            case 'created': return <span><b>{name}</b> membuat task baru: <i>{taskName}</i></span>;
            case 'checklist_checked': return <span><b>{name}</b> menyelesaikan checklist pada <i>{taskName}</i></span>;
            case 'review_requested': return <span><b>{name}</b> mengajukan review untuk <i>{taskName}</i></span>;
            case 'revised': return <span><b>{name}</b> meminta revisi pada <i>{taskName}</i></span>;
            case 'approved': return <span><b>{name}</b> menyetujui task <i>{taskName}</i></span>;
            case 'moved': return <span><b>{name}</b> memindahkan task <i>{taskName}</i> {log.details ? `ke ${log.details}` : ''}</span>;
            default: return <span><b>{name}</b> melakukan aksi pada <i>{taskName}</i></span>;
        }
    };

    if (loading) return <LoadingSpinner message="Memuat riwayat aktivitas..." />;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h1 className="page-title">Activity Feed</h1>
                <p className="page-subtitle">Pantau aktivitas magang secara real-time.</p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
                {logs.length === 0 ? (
                    <div style={{ padding: 'var(--space-24) 0' }}>
                        <EmptyState 
                            icon={<Activity size={48} />}
                            title="No Activity Yet"
                            description="There is no recent activity recorded in the system."
                        />
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {logs.map((log) => (
                            <div key={log.id} style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ 
                                    width: 32, height: 32, borderRadius: '50%', backgroundColor: '#F3F4F6', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                                }}>
                                    {getActionIcon(log.action)}
                                </div>
                                <div style={{ flex: 1, paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                                        {formatActionText(log)}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Clock size={12} />
                                        {new Date(log.created_at).toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
