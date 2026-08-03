import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Smile, Meh, Frown, Clock, Calendar, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Drawer } from '../components/ui/Drawer';
import { Timeline, TimelineItem } from '../components/ui/Timeline';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { FilterBar } from '../components/ui/FilterBar';

interface LogbookEntry {
    id: number;
    date: string;
    start_time: string | null;
    end_time: string | null;
    time: string;
    activity: string;
    result: string | null;
    obstacle: string | null;
    documentation_path: string | null;
    mood: string | null;
    status: string;
    mentor_notes: string | null;
    intern?: {
        name: string;
    };
}

const Logbook: React.FC = () => {
    const { user } = useAuth();
    const [entries, setEntries] = useState<LogbookEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    // Filtering
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    // Approval state
    const [reviewNotes, setReviewNotes] = useState('');
    const [reviewingId, setReviewingId] = useState<number | null>(null);

    // Form state
    const [activity, setActivity] = useState('');
    const [result, setResult] = useState('');
    const [obstacle, setObstacle] = useState('');
    const [startTime, setStartTime] = useState('07:30');
    const [endTime, setEndTime] = useState('15:00');
    const [mood, setMood] = useState('good');
    const [photo, setPhoto] = useState<File | null>(null);

    const fetchLogbook = async () => {
        try {
            setLoading(true);
            const response = await api.get('/logbook');
            setEntries(response.data.data);
        } catch (error) {
            console.error('Failed to fetch logbook', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogbook();
    }, []);

    const handleApprove = async (id: number, status: string) => {
        try {
            await api.patch(`/logbook/${id}/approve`, {
                status,
                mentor_notes: reviewNotes
            });
            setReviewingId(null);
            setReviewNotes('');
            fetchLogbook();
        } catch (error) {
            alert('Gagal menyimpan persetujuan');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <Badge variant="success">Approved</Badge>;
            case 'rejected': return <Badge variant="danger">Rejected</Badge>;
            default: return <Badge variant="warning">Pending</Badge>;
        }
    };

    const getTimelineStatus = (status: string) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'danger';
            default: return 'warning';
        }
    };

    const compressImage = async (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1000;
                    const MAX_HEIGHT = 1000;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = Math.round((height *= MAX_WIDTH / width));
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = Math.round((width *= MAX_HEIGHT / height));
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
                        } else {
                            resolve(file); // fallback
                        }
                    }, 'image/jpeg', 0.75);
                };
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const date = new Date().toISOString().split('T')[0];
            const formData = new FormData();
            formData.append('date', date);
            formData.append('start_time', startTime);
            formData.append('end_time', endTime);
            formData.append('mood', mood);
            formData.append('activity', activity);
            if (result) formData.append('result', result);
            if (obstacle) formData.append('obstacle', obstacle);
            
            if (photo) {
                const compressedPhoto = await compressImage(photo);
                formData.append('documentation_photo', compressedPhoto);
            }

            await api.post('/logbook', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setIsDrawerOpen(false);
            setActivity(''); setResult(''); setObstacle(''); setPhoto(null);
            setStartTime('07:30'); setEndTime('15:00'); setMood('good');
            fetchLogbook();
        } catch (error) {
            alert('Gagal menyimpan logbook');
        }
    };

    const getMoodEmoji = (moodStatus: string | null) => {
        switch (moodStatus) {
            case 'great': return <div style={{display:'flex', gap:'4px', alignItems:'center', color:'var(--success)'}}><Smile size={16}/> Great</div>;
            case 'good': return <div style={{display:'flex', gap:'4px', alignItems:'center', color:'var(--primary)'}}><Smile size={16}/> Good</div>;
            case 'okay': return <div style={{display:'flex', gap:'4px', alignItems:'center', color:'var(--warning)'}}><Meh size={16}/> Okay</div>;
            case 'bad': return <div style={{display:'flex', gap:'4px', alignItems:'center', color:'var(--danger)'}}><Frown size={16}/> Bad</div>;
            case 'stressed': return <div style={{display:'flex', gap:'4px', alignItems:'center', color:'var(--danger)'}}><Frown size={16}/> Stressed</div>;
            default: return null;
        }
    };

    const filteredEntries = entries.filter(entry => {
        const matchSearch = entry.activity.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter ? entry.status === statusFilter : true;
        return matchSearch && matchStatus;
    });

    const activeFiltersCount = (searchQuery ? 1 : 0) + (statusFilter ? 1 : 0);

    const renderEntryDetails = (entry: LogbookEntry) => (
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
            <p style={{ color: 'var(--text-main)', fontSize: 'var(--font-size-body)', fontWeight: 500, lineHeight: 1.6 }}>{entry.activity}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-12)' }}>
                {entry.result && (
                    <div style={{ padding: 'var(--space-12)', backgroundColor: 'var(--success-light)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <h5 style={{ fontSize: 'var(--font-size-caption)', color: 'var(--success)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Results</h5>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-main)', margin: 0 }}>{entry.result}</p>
                    </div>
                )}
                {entry.obstacle && (
                    <div style={{ padding: 'var(--space-12)', backgroundColor: 'var(--danger-light)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <h5 style={{ fontSize: 'var(--font-size-caption)', color: 'var(--danger)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Challenges</h5>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-main)', margin: 0 }}>{entry.obstacle}</p>
                    </div>
                )}
            </div>

            {entry.documentation_path && (
                <div style={{ marginTop: 'var(--space-8)' }}>
                    <h5 style={{ fontSize: 'var(--font-size-caption)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Documentation</h5>
                    <div style={{ width: '100%', maxWidth: '480px', height: '240px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <img src={entry.documentation_path} alt="Documentation" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>
            )}

            {entry.mentor_notes && (
                <div style={{ padding: 'var(--space-12)', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <h5 style={{ fontSize: 'var(--font-size-caption)', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Mentor Notes</h5>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-main)' }}>{entry.mentor_notes}</p>
                </div>
            )}

            {user?.role !== 'intern' && (entry.status === 'pending' || !entry.status) && (
                <div style={{ marginTop: 'var(--space-16)', padding: 'var(--space-16)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: 'var(--font-size-button)', fontWeight: 600, marginBottom: 'var(--space-8)' }}>Review Logbook</h4>
                    {reviewingId === entry.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                            <textarea 
                                className="ds-textarea" 
                                rows={3} 
                                placeholder="Add notes for the intern (optional)..."
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                style={{ width: '100%', padding: 'var(--space-8)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                            />
                            <div style={{ display: 'flex', gap: 'var(--space-8)', justifyContent: 'flex-end' }}>
                                <Button variant="ghost" size="sm" onClick={() => { setReviewingId(null); setReviewNotes(''); }}>Cancel</Button>
                                <Button variant="danger" size="sm" onClick={() => handleApprove(entry.id, 'rejected')}>Reject</Button>
                                <Button variant="primary" size="sm" onClick={() => handleApprove(entry.id, 'approved')}>Approve</Button>
                            </div>
                        </div>
                    ) : (
                        <Button variant="outline" size="sm" onClick={() => setReviewingId(entry.id)}>Review Entry</Button>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
            
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 700, margin: '0 0 var(--space-4) 0' }}>Daily Logbook</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Track your daily activities and internship progress seamlessly.</p>
                </div>
                {user?.role === 'intern' && (
                    <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setIsDrawerOpen(true)}>
                        New Entry
                    </Button>
                )}
            </div>

            {/* Filter Area */}
            <FilterBar activeFiltersCount={activeFiltersCount} onClearFilters={() => { setSearchQuery(''); setStatusFilter(''); }}>
                <div style={{ display: 'flex', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
                    <Input 
                        placeholder="Search activities..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search size={16} />}
                        style={{ maxWidth: '300px' }}
                    />
                    <Select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                            { value: '', label: 'All Status' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'approved', label: 'Approved' },
                            { value: 'rejected', label: 'Rejected' },
                        ]}
                    />
                </div>
            </FilterBar>

            {/* Content Area */}
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                    <Skeleton height="80px" style={{ borderRadius: 'var(--radius-md)' }} />
                    <Skeleton height="80px" style={{ borderRadius: 'var(--radius-md)' }} />
                    <Skeleton height="80px" style={{ borderRadius: 'var(--radius-md)' }} />
                </div>
            ) : filteredEntries.length === 0 ? (
                <EmptyState 
                    title="No Logbook Entries" 
                    description={activeFiltersCount > 0 ? "No entries match your current filters." : "You haven't recorded any daily activities yet."}
                    icon={<Clock size={48} />}
                    primaryAction={activeFiltersCount > 0 
                        ? <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter(''); }}>Clear Filters</Button>
                        : (user?.role === 'intern' ? <Button variant="primary" onClick={() => setIsDrawerOpen(true)}>Create Entry</Button> : undefined)
                    }
                />
            ) : (
                <div style={{ backgroundColor: 'var(--background)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-24)', border: '1px solid var(--border)' }}>
                    {user?.role !== 'intern' ? (
                        Object.entries(
                            filteredEntries.reduce((acc: any, entry) => {
                                const name = entry.intern?.name || 'Unknown Intern';
                                if (!acc[name]) acc[name] = [];
                                acc[name].push(entry);
                                return acc;
                            }, {})
                        ).map(([internName, internEntries]: [string, any]) => (
                            <div key={internName} style={{ marginBottom: 'var(--space-32)' }}>
                                <h3 style={{ fontSize: 'var(--font-size-h4)', fontWeight: 600, marginBottom: 'var(--space-16)', display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)' }}>
                                        {internName.charAt(0).toUpperCase()}
                                    </div>
                                    {internName}
                                </h3>
                                <Timeline items={internEntries.map((entry: any) => ({
                                    title: (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                            {getStatusBadge(entry.status || 'pending')}
                                        </div>
                                    ),
                                    time: (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)', color: 'var(--text-muted)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {entry.start_time?.substring(0,5) || entry.time} - {entry.end_time?.substring(0,5) || 'Done'}</span>
                                            {getMoodEmoji(entry.mood)}
                                        </div>
                                    ),
                                    description: renderEntryDetails(entry),
                                    status: getTimelineStatus(entry.status || 'pending')
                                }))} />
                            </div>
                        ))
                    ) : (
                        <Timeline items={filteredEntries.map(entry => ({
                            title: (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
                                    <span>{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                    {getStatusBadge(entry.status || 'pending')}
                                </div>
                            ),
                            time: (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)', color: 'var(--text-muted)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> {entry.start_time?.substring(0,5) || entry.time} - {entry.end_time?.substring(0,5) || 'Done'}</span>
                                    {getMoodEmoji(entry.mood)}
                                </div>
                            ),
                            description: renderEntryDetails(entry),
                            status: getTimelineStatus(entry.status || 'pending') as any
                        }))} />
                    )}
                </div>
            )}

            {/* Create Drawer */}
            <Drawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)}
                title="New Logbook Entry"
                description="Record your daily internship activities and learnings."
                size="md"
            >
                <form id="logbookForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-16)' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Start Time</label>
                            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required fullWidth />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>End Time</label>
                            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required fullWidth />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Today's Mood</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                            {[
                                { val: 'great', icon: Smile, label: 'Great', color: '#10B981', bg: '#ECFDF5' },
                                { val: 'good', icon: Smile, label: 'Good', color: '#3B82F6', bg: '#EFF6FF' },
                                { val: 'okay', icon: Meh, label: 'Okay', color: '#F59E0B', bg: '#FFFBEB' },
                                { val: 'bad', icon: Frown, label: 'Bad', color: '#F97316', bg: '#FFF7ED' },
                                { val: 'stressed', icon: Frown, label: 'Stressed', color: '#EF4444', bg: '#FEF2F2' }
                            ].map(m => (
                                <button 
                                    key={m.val}
                                    type="button" 
                                    onClick={() => setMood(m.val)} 
                                    style={{ 
                                        padding: '12px 8px', 
                                        border: mood === m.val ? `2px solid ${m.color}` : '1px solid var(--border)', 
                                        borderRadius: 'var(--radius-lg)', 
                                        backgroundColor: mood === m.val ? m.bg : 'var(--background)', 
                                        color: mood === m.val ? m.color : 'var(--text-muted)', 
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' 
                                    }}
                                >
                                    <m.icon size={20} /> <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Activity Details</label>
                        <textarea 
                            value={activity} 
                            onChange={(e) => setActivity(e.target.value)} 
                            placeholder="E.g., Configured server environment and wrote API endpoints..." 
                            required 
                            style={{ width: '100%', minHeight: '100px', padding: 'var(--space-12)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', resize: 'vertical' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Results (Optional)</label>
                        <textarea 
                            value={result} 
                            onChange={(e) => setResult(e.target.value)} 
                            placeholder="E.g., APIs are successfully deployed and tested..." 
                            style={{ width: '100%', minHeight: '80px', padding: 'var(--space-12)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', resize: 'vertical' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Challenges (Optional)</label>
                        <textarea 
                            value={obstacle} 
                            onChange={(e) => setObstacle(e.target.value)} 
                            placeholder="E.g., Faced CORS issues during integration..." 
                            style={{ width: '100%', minHeight: '80px', padding: 'var(--space-12)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', resize: 'vertical' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Documentation Photo (Optional)</label>
                        <div style={{ position: 'relative', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-16)', textAlign: 'center', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            {photo ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                    <img src={URL.createObjectURL(photo)} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 'var(--radius-md)' }} />
                                    <Button variant="outline" size="sm" onClick={() => setPhoto(null)}>Remove Photo</Button>
                                </div>
                            ) : (
                                <>
                                    <div style={{ width: 48, height: 48, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                                        <Plus size={24} />
                                    </div>
                                    <p style={{ margin: 0, fontWeight: 500 }}>Click to upload photo</p>
                                    <p style={{ margin: '4px 0 0 0', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>JPG, PNG (Max 5MB)</p>
                                    <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)} style={{ position: 'absolute', opacity: 0, cursor: 'pointer', inset: 0 }} />
                                </>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-12)', justifyContent: 'flex-end', paddingTop: 'var(--space-16)', borderTop: '1px solid var(--border)' }}>
                        <Button variant="ghost" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Logbook</Button>
                    </div>
                </form>
            </Drawer>
        </div>
    );
};

export default Logbook;
