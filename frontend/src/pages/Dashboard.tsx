import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { 
    Activity, Clock, CheckCircle, AlertTriangle, Plus, FileText, 
    TrendingUp, Calendar as CalendarIcon, Megaphone, 
    ArrowUpRight, ArrowDownRight, Users, PlayCircle, BarChart2, Inbox
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ToastContainer, type ToastProps } from '../components/ui/Toast';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { BarChart, DonutChart } from '../components/ui/Chart';
import { LinearProgress } from '../components/ui/Progress';
import { Timeline, TimelineItem } from '../components/ui/Timeline';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

// Removed mockActivityData as it is now provided by backend

const mockAnnouncements = [
    { id: 1, title: 'System Maintenance Scheduled', date: '2026-08-10', type: 'warning' },
    { id: 2, title: 'Logbook Submission Deadline Extended', date: '2026-08-05', type: 'info' },
    { id: 3, title: 'New Internship Guidelines Available', date: '2026-08-01', type: 'success' },
];

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [toasts, setToasts] = useState<ToastProps[]>([]);
    const [stats, setStats] = useState({
        active_tasks: 0,
        review_tasks: 0,
        completed_tasks: 0,
        late_tasks: 0,
        total_logbooks: 0,
        weekly_deadlines: [] as any[],
        interns_progress: [] as any[],
        leaderboard: [] as any[],
        pending_logbooks: [] as any[],
        weekly_activity: [] as any[],
    });

    const addToast = (title: string, message?: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, title, message, type, onClose: (id) => setToasts(t => t.filter(toast => toast.id !== id)) }]);
    };

    const [pendingInterns, setPendingInterns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [selectedInternId, setSelectedInternId] = useState<number | null>(null);
    const [mentors, setMentors] = useState<any[]>([]);
    const [divisions, setDivisions] = useState<any[]>([]);
    const [selectedMentor, setSelectedMentor] = useState('');
    const [selectedDivision, setSelectedDivision] = useState('');
    const [activities, setActivities] = useState<any[]>([]);

    const fetchDashboard = async () => {
        try {
            const response = await api.get('/dashboard');
            setStats(response.data.data);
            
            try {
                const notifRes = await api.get('/notifications');
                setActivities(notifRes.data.data);
            } catch (e) {
                console.error("Failed to fetch activities", e);
            }

            if (user?.role !== 'intern') {
                const resPending = await api.get('/admin/pending-interns');
                setPendingInterns(resPending.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, [user]);

    const openApproveModal = async (internId: number) => {
        setSelectedInternId(internId);
        try {
            if (mentors.length === 0) {
                const mRes = await api.get('/mentors');
                setMentors(mRes.data.data);
            }
            if (divisions.length === 0) {
                const dRes = await api.get('/master/divisions');
                setDivisions(dRes.data.data);
            }
            setShowModal(true);
        } catch (error) {
            console.error("Failed to load mentor/division data", error);
        }
    };

    const handleApprove = async () => {
        if (!selectedMentor || !selectedDivision) return alert("Pilih Mentor dan Divisi!");
        if (!confirm('Setujui akun ini?')) return;
        try {
            await api.patch(`/admin/approve-intern/${selectedInternId}`, { 
                mentor_id: selectedMentor, 
                division_id: selectedDivision 
            });
            setShowModal(false);
            setSelectedMentor('');
            setSelectedDivision('');
            fetchDashboard();
        } catch (error) {
            alert('Gagal menyetujui akun');
        }
    };

    const handleReject = async (internId: number) => {
        if (!confirm('Tolak dan hapus pendaftaran akun ini? Data tidak bisa dikembalikan.')) return;
        try {
            await api.delete(`/admin/reject-intern/${internId}`);
            fetchDashboard();
        } catch (error) {
            alert('Gagal menolak akun');
        }
    };

    const handleLogbookAction = async (logbookId: number, status: 'approved' | 'rejected') => {
        if (!confirm(`Are you sure you want to ${status} this logbook?`)) return;
        try {
            await api.patch(`/logbook/${logbookId}/approve`, { status, mentor_notes: null });
            addToast('Berhasil', `Logbook berhasil di-${status}`, 'success');
            fetchDashboard();
        } catch (error) {
            addToast('Gagal', `Gagal mengubah status logbook`, 'error');
        }
    };

    const totalTasks = stats.active_tasks + stats.review_tasks + stats.completed_tasks + stats.late_tasks;
    const progressPercentage = totalTasks > 0 ? Math.round((stats.completed_tasks / totalTasks) * 100) : 0;
    
    // Dynamic Greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    
    const distributionData = [
        { name: 'Active', value: stats.active_tasks || 1 },
        { name: 'Review', value: stats.review_tasks || 1 },
        { name: 'Done', value: stats.completed_tasks || 1 },
        { name: 'Late', value: stats.late_tasks || 0 },
    ];

    const timelineItems = activities.slice(0, 5).map(notif => {
        let statusStr = 'primary';
        if (notif.type?.includes('approve') || notif.type?.includes('success')) statusStr = 'success';
        else if (notif.type?.includes('reject') || notif.type?.includes('fail')) statusStr = 'danger';
        else if (notif.type?.includes('task') || notif.type?.includes('warning')) statusStr = 'warning';

        const timeStr = new Date(notif.created_at).toLocaleDateString('id-ID') + ' ' + new Date(notif.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        return {
            title: notif.title,
            description: notif.message,
            time: timeStr,
            status: statusStr
        };
    });

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
                <Skeleton width="100%" height="150px" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-24)' }}>
                    <Skeleton width="100%" height="120px" />
                    <Skeleton width="100%" height="120px" />
                    <Skeleton width="100%" height="120px" />
                    <Skeleton width="100%" height="120px" />
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
            
            {/* HERO SECTION */}
            <div className="bento-grid">
                <Card className="bento-item col-span-12" style={{ 
                    background: 'linear-gradient(135deg, var(--surface) 0%, rgba(15,82,186,0.05) 100%)', 
                    border: '1px solid var(--border)',
                    padding: 'var(--space-32)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', marginBottom: 'var(--space-8)' }}>
                            <Badge variant="primary" style={{ textTransform: 'uppercase' }}>Academic Year 2026/2027</Badge>
                            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-caption)' }}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 'var(--space-8)', letterSpacing: '-0.02em' }}>
                            {greeting}, {user?.name?.split(' ')[0]}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-body)', maxWidth: '600px', lineHeight: 1.6 }}>
                            Here is your mission control for today. You have <strong>{stats.active_tasks} active tasks</strong> and <strong>{stats.weekly_deadlines.length} upcoming deadlines</strong> this week.
                        </p>
                    </div>
                    {user?.role === 'intern' && (
                        <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
                            <Link to="/tasks" style={{ textDecoration: 'none' }}>
                                <Button variant="outline" leftIcon={<Plus size={16} />}>New Task</Button>
                            </Link>
                            <Link to="/logbook" style={{ textDecoration: 'none' }}>
                                <Button variant="primary" leftIcon={<FileText size={16} />}>Fill Logbook</Button>
                            </Link>
                        </div>
                    )}
                </Card>
            </div>

            {/* KPI METRICS */}
            <div className="bento-grid">
                <Card className="bento-item col-span-3" style={{ padding: 'var(--space-24)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-16)' }}>
                        <div>
                            <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Active Tasks</p>
                            <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>{stats.active_tasks}</h3>
                        </div>
                        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Activity size={24} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', fontWeight: 600 }}><ArrowUpRight size={14}/> 12%</span>
                        vs last week
                    </div>
                </Card>

                <Card className="bento-item col-span-3" style={{ padding: 'var(--space-24)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-16)' }}>
                        <div>
                            <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Needs Review</p>
                            <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>{stats.review_tasks}</h3>
                        </div>
                        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Clock size={24} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', fontWeight: 600 }}><ArrowDownRight size={14}/> 4%</span>
                        vs last week
                    </div>
                </Card>

                <Card className="bento-item col-span-3" style={{ padding: 'var(--space-24)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-16)' }}>
                        <div>
                            <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Completed</p>
                            <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>{stats.completed_tasks}</h3>
                        </div>
                        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', fontWeight: 600 }}><ArrowUpRight size={14}/> 18%</span>
                        vs last week
                    </div>
                </Card>

                <Card className="bento-item col-span-3" style={{ padding: 'var(--space-24)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-16)' }}>
                        <div>
                            <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Overdue</p>
                            <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>{stats.late_tasks}</h3>
                        </div>
                        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertTriangle size={24} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', fontWeight: 600 }}>0%</span>
                        vs last week
                    </div>
                </Card>
            </div>

            {/* MAIN ANALYTICS */}
            <div className="bento-grid">
                <Card className="bento-item col-span-8">
                    <CardHeader>
                        <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}><BarChart2 size={18}/> Weekly Activity Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BarChart 
                            data={stats.weekly_activity && stats.weekly_activity.length > 0 ? stats.weekly_activity : [
                                { name: 'Mon', tasks: 0, logbooks: 0 },
                                { name: 'Tue', tasks: 0, logbooks: 0 },
                                { name: 'Wed', tasks: 0, logbooks: 0 },
                                { name: 'Thu', tasks: 0, logbooks: 0 },
                                { name: 'Fri', tasks: 0, logbooks: 0 },
                                { name: 'Sat', tasks: 0, logbooks: 0 },
                                { name: 'Sun', tasks: 0, logbooks: 0 },
                            ]} 
                            height={280} 
                            bars={[
                                { dataKey: 'tasks', name: 'Tasks Completed', color: 'var(--primary)' },
                                { dataKey: 'logbooks', name: 'Logbooks Filled', color: 'var(--info)' }
                            ]} 
                        />
                    </CardContent>
                </Card>
                <Card className="bento-item col-span-4">
                    <CardHeader>
                        <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}><PlayCircle size={18}/> Task Distribution</CardTitle>
                    </CardHeader>
                    <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <DonutChart 
                            data={distributionData} 
                            dataKey="value" 
                            nameKey="name" 
                            height={240}
                            colors={['var(--info)', 'var(--warning)', 'var(--success)', 'var(--danger)']}
                        />
                        <div style={{ width: '100%', marginTop: 'var(--space-16)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)' }}>Overall Completion</span>
                                <span style={{ fontSize: 'var(--font-size-caption)', fontWeight: 600 }}>{progressPercentage}%</span>
                            </div>
                            <LinearProgress value={progressPercentage} color="primary" size="md" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ACTION CENTER & TIMELINE */}
            <div className="bento-grid">
                
                {/* Pending Tasks */}
                <Card className="bento-item col-span-8">
                    <CardHeader>
                        <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}><CheckCircle size={18}/> Action Center: Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                            {stats.weekly_deadlines.length === 0 ? (
                                <EmptyState 
                                    icon={<CheckCircle size={48} />}
                                    title="All caught up!"
                                    description="No immediate deadlines for this week."
                                />
                            ) : (
                                stats.weekly_deadlines.map(task => (
                                    <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-16)', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)' }}>
                                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: task.status === 'review' ? 'var(--warning)' : 'var(--danger)' }}></div>
                                            <div>
                                                <h4 style={{ margin: '0 0 4px 0', fontSize: 'var(--font-size-button)', fontWeight: 600 }}>{task.title}</h4>
                                                <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)' }}>Status: {task.status.toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)' }}>
                                            <Badge variant={task.status === 'review' ? 'warning' : 'danger'}>
                                                Due: {new Date(task.deadline).toLocaleDateString()}
                                            </Badge>
                                            <Link to="/tasks" style={{ textDecoration: 'none' }}>
                                                <Button variant="outline" size="sm">Action</Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Timeline */}
                <Card className="bento-item col-span-4">
                    <CardHeader>
                        <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}><Activity size={18}/> Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {timelineItems.length > 0 ? (
                            <Timeline items={timelineItems} />
                        ) : (
                            <EmptyState 
                                icon={<Activity size={48} />}
                                title="No Recent Activity"
                                description="You have no notifications yet."
                            />
                        )}
                    </CardContent>
                </Card>

            </div>

            {/* PENDING LOGBOOKS */}
            {user?.role !== 'intern' && (
                <div className="bento-grid">
                    <Card className="bento-item col-span-12">
                        <CardHeader>
                            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}><FileText size={18}/> Logbook Needs Review</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Activity</TableHead>
                                        <TableHead style={{ textAlign: 'right' }}>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!stats.pending_logbooks || stats.pending_logbooks.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} style={{ padding: '0' }}>
                                                <EmptyState 
                                                    icon={<CheckCircle size={48} />}
                                                    title="All Caught Up"
                                                    description="No logbooks are currently waiting for your review."
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        stats.pending_logbooks.map((logbook: any) => (
                                            <TableRow key={logbook.id}>
                                                <TableCell style={{ fontWeight: 600 }}>{logbook.intern_name}</TableCell>
                                                <TableCell>{logbook.date}</TableCell>
                                                <TableCell>{logbook.activity.length > 50 ? logbook.activity.substring(0, 50) + '...' : logbook.activity}</TableCell>
                                                <TableCell style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <Button variant="outline" size="sm" onClick={() => handleLogbookAction(logbook.id, 'rejected')} style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}>Reject</Button>
                                                    <Button variant="primary" size="sm" onClick={() => handleLogbookAction(logbook.id, 'approved')}>Approve</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ANNOUNCEMENTS (Full Width Bottom) */}
            <div className="bento-grid">
                <Card className="bento-item col-span-12">
                    <CardHeader>
                        <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}><Megaphone size={18}/> System Announcements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-16)' }}>
                            {mockAnnouncements.map(ann => (
                                <div key={ann.id} style={{ padding: 'var(--space-16)', backgroundColor: `var(--${ann.type}-light, var(--surface-hover))`, borderRadius: 'var(--radius-md)', borderLeft: `4px solid var(--${ann.type})` }}>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: 'var(--font-size-button)', fontWeight: 600 }}>{ann.title}</h4>
                                    <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <CalendarIcon size={12}/> {ann.date}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ADMIN / MENTOR LEADERBOARD */}
            {user?.role !== 'intern' && (
                <div className="bento-grid">
                    <Card className="bento-item col-span-8">
                        <CardHeader>
                            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}><Users size={18}/> Pending Approvals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead style={{ textAlign: 'right' }}>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingInterns.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} style={{ padding: '0' }}>
                                                <EmptyState 
                                                    icon={<Inbox size={48} />}
                                                    title="No Pending Approvals"
                                                    description="There are no intern accounts waiting for approval."
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pendingInterns.map(intern => (
                                            <TableRow key={intern.id}>
                                                <TableCell style={{ fontWeight: 600 }}>{intern.name}</TableCell>
                                                <TableCell>{intern.email}</TableCell>
                                                <TableCell style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <Button variant="outline" size="sm" onClick={() => handleReject(intern.id)} style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}>Reject</Button>
                                                    <Button variant="primary" size="sm" onClick={() => openApproveModal(intern.id)}>Approve</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="bento-item col-span-4">
                        <CardHeader>
                            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}><TrendingUp size={18} color="var(--primary)"/> Top Performers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                                {stats.leaderboard?.map((intern: any, index: number) => (
                                    <div key={intern.id} style={{ 
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                                        padding: 'var(--space-12)', backgroundColor: index === 0 ? 'rgba(245, 158, 11, 0.05)' : 'var(--background)', 
                                        borderRadius: 'var(--radius-md)', border: index === 0 ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid var(--border)', 
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
                                            <div style={{ 
                                                width: 32, height: 32, borderRadius: '50%', 
                                                backgroundColor: index === 0 ? 'var(--warning)' : 'var(--surface-hover)', 
                                                color: index === 0 ? 'white' : 'var(--text-main)', 
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                                fontWeight: 800, fontSize: '14px', 
                                            }}>
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <h4 style={{ fontWeight: 600, color: index === 0 ? '#92400E' : 'var(--text-main)', fontSize: 'var(--font-size-button)', margin: 0 }}>{intern.name}</h4>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
                                            <div style={{ fontSize: 'var(--font-size-button)', fontWeight: 700, color: 'var(--text-main)' }}>
                                                {intern.points} <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>pts</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Approval Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '400px' }}>
                        <h3 style={{ marginTop: 0, color: '#000' }}>Assign Mentor & Division</h3>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 600 }}>Mentor</label>
                            <select style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} value={selectedMentor} onChange={e => setSelectedMentor(e.target.value)}>
                                <option value="">Pilih Mentor</option>
                                {mentors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 600 }}>Division</label>
                            <select style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} value={selectedDivision} onChange={e => setSelectedDivision(e.target.value)}>
                                <option value="">Pilih Divisi</option>
                                {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
                            <Button variant="primary" onClick={handleApprove}>Approve Intern</Button>
                        </div>
                    </div>
                </div>
            )}
            
            <ToastContainer toasts={toasts} />
        </div>
    );
};

export default Dashboard;
