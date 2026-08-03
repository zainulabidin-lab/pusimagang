import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Plus, MoreVertical, Calendar, CheckSquare, Activity, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Drawer } from '../components/ui/Drawer';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { FilterBar } from '../components/ui/FilterBar';
import { StepProgress } from '../components/ui/Progress';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

const TaskBoard: React.FC = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<any>({ todo: [], progress: [], review: [], done: [] });
    const [templates, setTemplates] = useState<any[]>([]);
    const [interns, setInterns] = useState<any[]>([]);
    const [competencies, setCompetencies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', deadline: '', intern_ids: [] as number[], template_id: '', competency_id: '', difficulty: 'easy' });

    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'checklist'>('overview');
    const [newChecklist, setNewChecklist] = useState('');
    
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tasksRes, templatesRes, internsRes, competenciesRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/master/templates'),
                api.get('/master/interns'),
                api.get('/master/competencies')
            ]);
            const rawTasks = tasksRes.data.data || [];
            const groupedTasks: any = { todo: [], progress: [], review: [], done: [] };
            rawTasks.forEach((t: any) => {
                if (groupedTasks[t.status]) groupedTasks[t.status].push(t);
            });
            setTasks(groupedTasks);
            
            setTemplates(templatesRes.data.data);
            setInterns(internsRes.data.data);
            setCompetencies(competenciesRes.data.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let finalInternIds = newTask.intern_ids;
            if (user?.role === 'intern') {
                if (finalInternIds.length === 0) {
                    finalInternIds = [user.id];
                } else if (!finalInternIds.includes(user.id)) {
                    finalInternIds = [...finalInternIds, user.id];
                }
            }

            await api.post('/tasks', { 
                ...newTask, 
                intern_ids: finalInternIds,
                template_id: newTask.template_id ? newTask.template_id : null,
                competency_id: newTask.competency_id ? newTask.competency_id : null
            });
            setIsCreateDrawerOpen(false);
            setNewTask({ title: '', description: '', priority: 'medium', deadline: '', intern_ids: [], template_id: '', competency_id: '', difficulty: 'easy' });
            fetchData();
        } catch (error: any) {
            alert('Gagal membuat task: ' + (error.response?.data?.message || 'Server error'));
        }
    };

    const handleMoveTask = async (taskId: number, newStatus: string) => {
        try {
            await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
            fetchData();
            if (selectedTask && selectedTask.id === taskId) {
                setSelectedTask({ ...selectedTask, status: newStatus });
            }
        } catch (error) {
            alert('Gagal mengubah status');
        }
    };

    const handleAddChecklist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChecklist.trim() || !selectedTask) return;
        try {
            const res = await api.post(`/tasks/${selectedTask.id}/checklists`, { description: newChecklist });
            setSelectedTask({
                ...selectedTask,
                checklists: [...(selectedTask.checklists || []), res.data.data]
            });
            setNewChecklist('');
            fetchData();
        } catch (error) {
            alert('Gagal menambah checklist');
        }
    };

    const handleToggleChecklist = async (checklistId: number) => {
        if (!selectedTask) return;
        try {
            const res = await api.patch(`/tasks/${selectedTask.id}/checklists/${checklistId}/toggle`);
            const updatedChecklists = selectedTask.checklists.map((c: any) => 
                c.id === checklistId ? res.data.data : c
            );
            setSelectedTask({ ...selectedTask, checklists: updatedChecklists });
            fetchData(); 
        } catch (error) {
            alert('Gagal mengubah checklist');
        }
    };

    const getDeadlineColor = (deadline: string) => {
        if (!deadline) return 'var(--text-muted)';
        const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        if (days < 0) return 'var(--danger)'; 
        if (days === 0) return 'var(--danger)'; 
        if (days <= 3) return 'var(--warning)'; 
        return 'var(--text-muted)'; 
    };

    const handleDrop = async (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        const taskIdStr = e.dataTransfer.getData('taskId');
        if (!taskIdStr) return;
        const taskId = parseInt(taskIdStr);

        let currentStatus = '';
        let foundTask = null;
        for (const status in tasks) {
            const task = tasks[status].find((t: any) => t.id === taskId);
            if (task) {
                currentStatus = status;
                foundTask = task;
                break;
            }
        }

        if (currentStatus === newStatus || !foundTask) return;

        setTasks((prev: any) => {
            const updated = { ...prev };
            updated[currentStatus] = updated[currentStatus].filter((t: any) => t.id !== taskId);
            foundTask.status = newStatus;
            updated[newStatus] = [...updated[newStatus], foundTask];
            return updated;
        });

        await handleMoveTask(taskId, newStatus);
    };

    const columns = [
        { id: 'todo', title: 'To Do', color: '#6B7280' },
        { id: 'progress', title: 'In Progress', color: '#3B82F6' },
        { id: 'review', title: 'Under Review', color: '#F59E0B' },
        { id: 'done', title: 'Done', color: '#10B981' }
    ];

    const filterTasks = (taskList: any[]) => {
        if (!searchQuery) return taskList;
        return taskList.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    const openTaskDetail = (task: any) => {
        setSelectedTask(task);
        setIsDetailDrawerOpen(true);
    };

    const getWorkflowSteps = (status: string) => {
        const statuses = ['todo', 'progress', 'review', 'done'];
        const currentIndex = statuses.indexOf(status);
        
        return [
            { label: 'Assigned', status: currentIndex >= 0 ? 'complete' : 'upcoming' as 'complete'|'current'|'upcoming' },
            { label: 'In Progress', status: currentIndex === 1 ? 'current' : (currentIndex > 1 ? 'complete' : 'upcoming') as any },
            { label: 'Under Review', status: currentIndex === 2 ? 'current' : (currentIndex > 2 ? 'complete' : 'upcoming') as any },
            { label: 'Done', status: currentIndex === 3 ? 'complete' : 'upcoming' as any },
        ];
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
            
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 700, margin: '0 0 var(--space-4) 0' }}>Task Board</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage and track your internship tasks.</p>
                </div>
                <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setIsCreateDrawerOpen(true)}>
                    New Task
                </Button>
            </div>

            <FilterBar activeFiltersCount={searchQuery ? 1 : 0} onClearFilters={() => setSearchQuery('')}>
                <Input 
                    placeholder="Search tasks by title..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search size={16} />}
                    style={{ maxWidth: '300px' }}
                />
            </FilterBar>

            {/* Kanban Board */}
            {loading ? (
                <div style={{ display: 'flex', gap: 'var(--space-16)', flex: 1 }}>
                    <Skeleton width="25%" height="100%" style={{ borderRadius: 'var(--radius-lg)' }} />
                    <Skeleton width="25%" height="100%" style={{ borderRadius: 'var(--radius-lg)' }} />
                    <Skeleton width="25%" height="100%" style={{ borderRadius: 'var(--radius-lg)' }} />
                    <Skeleton width="25%" height="100%" style={{ borderRadius: 'var(--radius-lg)' }} />
                </div>
            ) : (
                <div style={{ display: 'flex', gap: 'var(--space-16)', flex: 1, overflowX: 'auto', paddingBottom: 'var(--space-8)' }}>
                    {columns.map(col => {
                        const colTasks = filterTasks(tasks[col.id] || []);
                        return (
                            <div 
                                key={col.id} 
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, col.id)}
                                style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-12)', border: '1px solid var(--border)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-12)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.color }}></div>
                                        <h3 style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', margin: 0 }}>{col.title}</h3>
                                    </div>
                                    <Badge variant="default">{colTasks.length}</Badge>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', flex: 1, overflowY: 'auto' }}>
                                    {colTasks.length === 0 ? (
                                        <div style={{ padding: 'var(--space-24) 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            <p style={{ fontSize: 'var(--font-size-sm)' }}>No tasks here</p>
                                        </div>
                                    ) : colTasks.map((task: any) => (
                                        <div 
                                            key={task.id} 
                                            draggable
                                            onDragStart={(e) => e.dataTransfer.setData('taskId', task.id.toString())}
                                            onClick={() => openTaskDetail(task)}
                                            style={{ backgroundColor: 'var(--background)', padding: 'var(--space-16)', borderRadius: 'var(--radius-md)', cursor: 'grab', display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', border: '1px solid var(--border)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                                            onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                                            onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <h4 style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', margin: 0, lineHeight: 1.4, color: 'var(--text-main)' }}>{task.title}</h4>
                                            </div>
                                            
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                                                <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
                                                    {task.deadline && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: getDeadlineColor(task.deadline), fontWeight: 500 }}>
                                                            <Calendar size={12} />
                                                            {new Date(task.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                                        </div>
                                                    )}
                                                    {task.checklists && task.checklists.length > 0 && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500, color: task.checklists.filter((c:any) => c.is_completed).length === task.checklists.length ? 'var(--success)' : 'var(--text-muted)' }}>
                                                            <CheckSquare size={12} />
                                                            {task.checklists.filter((c:any) => c.is_completed).length}/{task.checklists.length}
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    {task.interns && task.interns.length > 0 ? (
                                                        task.interns.slice(0, 3).map((intern: any, i: number) => (
                                                            <div key={intern.id} style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--primary-light)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--primary)', marginLeft: i > 0 ? '-8px' : '0', zIndex: 10 - i }} title={intern.name}>
                                                                {intern.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--text-main)' }}>
                                                            -
                                                        </div>
                                                    )}
                                                    {task.interns && task.interns.length > 3 && (
                                                        <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', marginLeft: '-8px', zIndex: 7 }}>
                                                            +{task.interns.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Task Drawer */}
            <Drawer 
                isOpen={isCreateDrawerOpen} 
                onClose={() => setIsCreateDrawerOpen(false)}
                title="Create New Task"
                description="Assign tasks to interns and set deadlines."
                size="md"
            >
                <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Task Title</label>
                        <Input value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} placeholder="e.g., Design new landing page" required fullWidth />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{user?.role === 'intern' ? 'Invite Teammates (Optional)' : 'Assign to Interns'}</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--border)', padding: 'var(--space-12)', borderRadius: 'var(--radius-md)' }}>
                            {interns.filter(i => user?.role !== 'intern' || i.id !== user?.id).map((intern: any) => (
                                <label key={intern.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={newTask.intern_ids.includes(intern.id)}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setNewTask(prev => ({
                                                ...prev,
                                                intern_ids: isChecked 
                                                    ? [...prev.intern_ids, intern.id]
                                                    : prev.intern_ids.filter(id => id !== intern.id)
                                            }));
                                        }}
                                        style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                                    />
                                    <span style={{ fontSize: 'var(--font-size-sm)' }}>{intern.name}</span>
                                </label>
                            ))}
                        </div>
                        {user?.role !== 'intern' && newTask.intern_ids.length === 0 && <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>Please select at least one intern</span>}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Use SOP Template (Optional)</label>
                        <Select value={newTask.template_id} onChange={(e) => setNewTask({...newTask, template_id: e.target.value})} options={[{value:'', label:'-- Select Template --'}, ...templates.map(t => ({value: t.id, label: t.name}))]} />
                    </div>
                    
                    <div style={{ display: 'flex', gap: 'var(--space-12)', backgroundColor: 'var(--surface)', padding: 'var(--space-12)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Link to Competency</label>
                            <Select value={newTask.competency_id} onChange={(e) => setNewTask({...newTask, competency_id: e.target.value})} options={[{value:'', label:'-- None --'}, ...competencies.map(c => ({value: c.id, label: c.name}))]} />
                        </div>
                        {newTask.competency_id && (
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Difficulty (XP)</label>
                                <Select value={newTask.difficulty} onChange={(e) => setNewTask({...newTask, difficulty: e.target.value})} options={[{value:'easy', label:'Easy (+10)'}, {value:'medium', label:'Medium (+25)'}, {value:'hard', label:'Hard (+50)'}]} />
                            </div>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Description</label>
                        <textarea 
                            value={newTask.description} 
                            onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
                            placeholder="Add more details..."
                            style={{ width: '100%', minHeight: '100px', padding: 'var(--space-12)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Priority</label>
                            <Select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})} options={[{value:'low', label:'Low'}, {value:'medium', label:'Medium'}, {value:'high', label:'High'}]} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Deadline</label>
                            <Input type="date" value={newTask.deadline} onChange={(e) => setNewTask({...newTask, deadline: e.target.value})} fullWidth />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-12)', paddingTop: 'var(--space-16)', borderTop: '1px solid var(--border)' }}>
                        <Button type="button" variant="ghost" onClick={() => setIsCreateDrawerOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Create Task</Button>
                    </div>
                </form>
            </Drawer>

            {/* Task Detail Drawer */}
            {selectedTask && (
                <Drawer 
                    isOpen={isDetailDrawerOpen} 
                    onClose={() => { setIsDetailDrawerOpen(false); setTimeout(() => setSelectedTask(null), 300); }}
                    title={<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>{selectedTask.title} <Badge variant="primary">{selectedTask.priority}</Badge></div>}
                    size="md"
                    footer={
                        <div style={{ display: 'flex', gap: 'var(--space-12)', width: '100%', justifyContent: 'flex-end' }}>
                            {selectedTask.status === 'todo' && user?.role === 'intern' && <Button variant="primary" onClick={() => handleMoveTask(selectedTask.id, 'progress')}>Start Task</Button>}
                            {selectedTask.status === 'progress' && user?.role === 'intern' && <Button variant="primary" onClick={() => handleMoveTask(selectedTask.id, 'review')}>Submit for Review</Button>}
                            {selectedTask.status === 'review' && user?.role !== 'intern' && (
                                <>
                                    <Button variant="danger" onClick={() => handleMoveTask(selectedTask.id, 'progress')}>Request Revision</Button>
                                    <Button variant="success" onClick={() => handleMoveTask(selectedTask.id, 'done')}>Approve & Complete</Button>
                                </>
                            )}
                        </div>
                    }
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
                        {/* Status Workflow Timeline */}
                        <div style={{ backgroundColor: 'var(--surface)', padding: 'var(--space-16)', borderRadius: 'var(--radius-md)' }}>
                            <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-main)', marginBottom: 'var(--space-16)' }}>Workflow Status</h4>
                            <StepProgress steps={getWorkflowSteps(selectedTask.status)} />
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: 'var(--space-24)', borderBottom: '1px solid var(--border)' }}>
                            <button onClick={() => setActiveTab('overview')} style={{ padding: '8px 0', background: 'none', border: 'none', borderBottom: activeTab === 'overview' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, fontSize: 'var(--font-size-sm)', cursor: 'pointer', transition: 'all 0.2s' }}>Overview</button>
                            <button onClick={() => setActiveTab('checklist')} style={{ padding: '8px 0', background: 'none', border: 'none', borderBottom: activeTab === 'checklist' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'checklist' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, fontSize: 'var(--font-size-sm)', cursor: 'pointer', transition: 'all 0.2s' }}>Checklist ({selectedTask.checklists?.filter((c:any)=>c.is_completed).length || 0}/{selectedTask.checklists?.length || 0})</button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'overview' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                                <div>
                                    <h4 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Description</h4>
                                    <p style={{ fontSize: 'var(--font-size-sm)', lineHeight: 1.6, color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>{selectedTask.description || 'No description provided.'}</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
                                    <div>
                                        <h4 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Deadline</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-sm)', color: 'var(--text-main)' }}>
                                            <Calendar size={14}/> {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString() : 'No Deadline'}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Assignees</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {selectedTask.interns?.map((intern:any) => (
                                                <Badge key={intern.id} variant="default">{intern.name}</Badge>
                                            ))}
                                            {!selectedTask.interns?.length && <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Unassigned</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'checklist' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                                {selectedTask.checklists?.map((item: any) => (
                                    <label key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='var(--surface-hover)'} onMouseOut={e=>e.currentTarget.style.backgroundColor='var(--background)'}>
                                        <input 
                                            type="checkbox" 
                                            checked={item.is_completed} 
                                            onChange={() => handleToggleChecklist(item.id)}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '2px', accentColor: 'var(--primary)' }}
                                        />
                                        <span style={{ fontSize: 'var(--font-size-sm)', textDecoration: item.is_completed ? 'line-through' : 'none', color: item.is_completed ? 'var(--text-muted)' : 'var(--text-main)', lineHeight: 1.5 }}>
                                            {item.description}
                                        </span>
                                    </label>
                                ))}
                                
                                {selectedTask.checklists?.length === 0 && <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-16)' }}>No checklists yet.</p>}

                                <form onSubmit={handleAddChecklist} style={{ display: 'flex', gap: '8px', marginTop: 'var(--space-8)' }}>
                                    <Input 
                                        placeholder="Add new step..." 
                                        value={newChecklist} 
                                        onChange={(e) => setNewChecklist(e.target.value)} 
                                        fullWidth
                                    />
                                    <Button type="submit" variant="outline">Add</Button>
                                </form>
                            </div>
                        )}
                    </div>
                </Drawer>
            )}
        </div>
    );
};

export default TaskBoard;
