import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, Activity } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Timeline } from '../components/ui/Timeline';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import api from '../services/api';

const History: React.FC = () => {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/activity-feed');
                setActivities(response.data.data);
            } catch (error) {
                console.error("Failed to fetch activity feed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                <Skeleton width="200px" height="40px" />
                <Skeleton width="100%" height="300px" />
            </div>
        );
    }

    const timelineItems = activities.map(act => {
        let statusStr: "primary" | "success" | "danger" | "warning" | "default" = 'primary';
        const actionLower = act.action?.toLowerCase() || '';
        
        if (actionLower.includes('approve') || actionLower.includes('done')) statusStr = 'success';
        else if (actionLower.includes('reject') || actionLower.includes('delete')) statusStr = 'danger';
        else if (actionLower.includes('submit') || actionLower.includes('review') || actionLower.includes('update')) statusStr = 'warning';

        const timeStr = new Date(act.created_at).toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        return {
            title: `${act.actor} - ${act.action}`,
            description: `Target: ${act.target} | Details: ${act.details || '-'}`,
            time: timeStr,
            status: statusStr
        };
    });

    return (
        <div style={{ padding: 'var(--space-24)', display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <HistoryIcon size={32} color="var(--primary)" />
                    Riwayat Aktivitas
                </h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                    Jejak audit dari semua pergerakan tugas dan logbook di dalam sistem.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={18} /> Timeline Aktivitas Terkini
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {timelineItems.length === 0 ? (
                        <EmptyState 
                            icon={<HistoryIcon size={48} />}
                            title="Belum Ada Riwayat"
                            description="Belum ada aktivitas yang terekam untuk ditampilkan di sini."
                        />
                    ) : (
                        <div style={{ padding: 'var(--space-16) 0' }}>
                            <Timeline items={timelineItems} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default History;
