import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { BookOpen, Plus, Edit2, Trash2, List, FileText, CheckCircle, PlusCircle, Save, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { FilterBar } from '../components/ui/FilterBar';

const SopManagement: React.FC = () => {
    const { user } = useAuth();
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        items: [] as { id?: number, description: string, order: number }[]
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/sop');
            setTemplates(res.data.data);
        } catch (error) {
            console.error('Failed to fetch SOP templates', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenCreate = () => {
        setIsEditing(false);
        setFormData({ id: '', name: '', description: '', items: [{ description: '', order: 1 }] });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (template: any) => {
        setIsEditing(true);
        setFormData({
            id: template.id,
            name: template.name,
            description: template.description || '',
            items: template.items?.length > 0 ? template.items.map((i: any) => ({ id: i.id, description: i.description, order: i.order })) : [{ description: '', order: 1 }]
        });
        setIsDrawerOpen(true);
    };

    const handleAddItem = () => {
        const nextOrder = formData.items.length > 0 ? Math.max(...formData.items.map(i => i.order)) + 1 : 1;
        setFormData({
            ...formData,
            items: [...formData.items, { description: '', order: nextOrder }]
        });
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...formData.items];
        newItems.splice(index, 1);
        newItems.forEach((item, i) => item.order = i + 1);
        setFormData({ ...formData, items: newItems });
    };

    const handleItemChange = (index: number, val: string) => {
        const newItems = [...formData.items];
        newItems[index].description = val;
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/sop/${formData.id}`, formData);
            } else {
                await api.post('/sop', formData);
            }
            setIsDrawerOpen(false);
            fetchData();
        } catch (error: any) {
            alert('Failed to save SOP: ' + (error.response?.data?.message || 'Server error'));
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this SOP Template? Tasks created with it will not be affected.')) {
            try {
                await api.delete(`/sop/${id}`);
                fetchData();
            } catch (error) {
                alert('Failed to delete SOP');
            }
        }
    };

    const filteredTemplates = templates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (user?.role === 'intern') {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 600 }}>Access Denied</h3>
                <p style={{ color: 'var(--text-muted)' }}>You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 700, margin: '0 0 var(--space-4) 0' }}>SOP Management</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage standard operating procedures and task templates.</p>
                </div>
                <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleOpenCreate}>
                    New Template
                </Button>
            </div>

            <FilterBar activeFiltersCount={searchQuery ? 1 : 0} onClearFilters={() => setSearchQuery('')}>
                <Input 
                    placeholder="Search templates by name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search size={16} />}
                    style={{ maxWidth: '300px' }}
                />
            </FilterBar>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-24)' }}>
                    <Skeleton height="250px" style={{ borderRadius: 'var(--radius-lg)' }} />
                    <Skeleton height="250px" style={{ borderRadius: 'var(--radius-lg)' }} />
                    <Skeleton height="250px" style={{ borderRadius: 'var(--radius-lg)' }} />
                </div>
            ) : filteredTemplates.length === 0 ? (
                <EmptyState 
                    title="No SOP Templates"
                    description={searchQuery ? "No templates match your search." : "Create a template to standardize tasks."}
                    icon={<FileText size={48} />}
                    primaryAction={!searchQuery ? <Button variant="primary" onClick={handleOpenCreate}>Create First SOP</Button> : undefined}
                />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-24)' }}>
                    {filteredTemplates.map(template => (
                        <div key={template.id} style={{ backgroundColor: 'var(--background)', padding: 'var(--space-24)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s' }} onMouseOver={e=>e.currentTarget.style.boxShadow='var(--shadow-md)'} onMouseOut={e=>e.currentTarget.style.boxShadow='none'}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-16)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
                                    <div style={{ padding: 'var(--space-8)', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-lg)' }}>
                                        <BookOpen size={20} />
                                    </div>
                                    <h3 style={{ fontSize: 'var(--font-size-h4)', fontWeight: 600, margin: 0, color: 'var(--text-main)' }}>{template.name}</h3>
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(template)} title="Edit"><Edit2 size={14} /></Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(template.id)} title="Delete" style={{ color: 'var(--danger)' }}><Trash2 size={14} /></Button>
                                </div>
                            </div>

                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 'var(--space-24)', flex: 1, whiteSpace: 'pre-wrap' }}>
                                {template.description || 'No description provided.'}
                            </p>

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-16)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-12)' }}>
                                    <List size={16} style={{ color: 'var(--text-muted)' }} />
                                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Checklist Items ({template.items?.length || 0})
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                                    {template.items?.slice(0, 3).map((item: any) => (
                                        <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                            <CheckCircle size={14} style={{ color: 'var(--primary)', marginTop: '3px', flexShrink: 0 }} />
                                            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-main)', lineHeight: 1.4 }}>{item.description}</span>
                                        </div>
                                    ))}
                                    {template.items?.length > 3 && (
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: '22px' }}>
                                            + {template.items.length - 3} more items...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Drawer */}
            <Drawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)}
                title={isEditing ? 'Edit SOP Template' : 'Create SOP Template'}
                size="md"
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Template Name</label>
                        <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g., Setup Environment" required fullWidth />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Description (Optional)</label>
                        <textarea 
                            className="ds-input" 
                            rows={3} 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                            placeholder="Brief overview of this procedure..."
                            style={{ width: '100%', padding: 'var(--space-12)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', resize: 'vertical' }}
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Checklist Items</label>
                            <Button type="button" variant="ghost" size="sm" onClick={handleAddItem} leftIcon={<PlusCircle size={14} />}>
                                Add Step
                            </Button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                            {formData.items.map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                                        {index + 1}
                                    </div>
                                    <Input 
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, e.target.value)}
                                        placeholder={`Step ${index + 1} description...`}
                                        required
                                        fullWidth
                                    />
                                    <Button type="button" variant="ghost" onClick={() => handleRemoveItem(index)} disabled={formData.items.length === 1} style={{ color: 'var(--danger)' }}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: 'var(--space-16)', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                        <Button type="button" variant="ghost" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" leftIcon={<Save size={16} />}>
                            Save Template
                        </Button>
                    </div>
                </form>
            </Drawer>
        </div>
    );
};

export default SopManagement;
