import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Star, Award, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { CircularProgress } from '../components/ui/Progress';
import { Badge } from '../components/ui/Badge';

const Evaluation: React.FC = () => {
    const { user } = useAuth();
    const [evaluations, setEvaluations] = useState<any[]>([]);
    const [interns, setInterns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    // Wizard State
    const [currentStep, setCurrentStep] = useState(1);
    
    const [formData, setFormData] = useState({
        intern_id: '',
        technical_score: 80,
        communication_score: 80,
        discipline_score: 80,
        problem_solving_score: 80,
        notes: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [evalRes, internsRes] = await Promise.all([
                api.get('/evaluations'),
                api.get('/master/interns')
            ]);
            setEvaluations(evalRes.data.data);
            setInterns(internsRes.data.data);
        } catch (error) {
            console.error("Failed to fetch evaluations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/evaluations', formData);
            setIsDrawerOpen(false);
            setFormData({
                intern_id: '', technical_score: 80, communication_score: 80, discipline_score: 80, problem_solving_score: 80, notes: ''
            });
            setCurrentStep(1);
            fetchData();
        } catch (error: any) {
            alert('Gagal menyimpan penilaian: ' + (error.response?.data?.message || 'Server error'));
        }
    };

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A': return 'var(--success)';
            case 'B': return 'var(--primary)';
            case 'C': return 'var(--warning)';
            default: return 'var(--danger)';
        }
    };
    
    const getGradeVariant = (grade: string) => {
        switch (grade) {
            case 'A': return 'success';
            case 'B': return 'primary';
            case 'C': return 'warning';
            default: return 'danger';
        }
    };

    const averageScore = Math.round(
        (formData.technical_score + formData.communication_score + formData.discipline_score + formData.problem_solving_score) / 4
    );

    return (
        <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 700, margin: '0 0 var(--space-4) 0' }}>Final Evaluation</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Performance review and final grades.</p>
                </div>
                {user?.role !== 'intern' && (
                    <Button variant="primary" leftIcon={<Star size={16} />} onClick={() => { setIsDrawerOpen(true); setCurrentStep(1); }}>
                        New Evaluation
                    </Button>
                )}
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--space-16)' }}>
                    <Skeleton height="250px" style={{ borderRadius: 'var(--radius-lg)' }} />
                    <Skeleton height="250px" style={{ borderRadius: 'var(--radius-lg)' }} />
                </div>
            ) : evaluations.length === 0 ? (
                <EmptyState 
                    title="No Evaluations Yet"
                    description="There are no final evaluation records in the system."
                    icon={<Award size={48} />}
                    primaryAction={user?.role !== 'intern' ? <Button variant="primary" onClick={() => setIsDrawerOpen(true)}>Create Evaluation</Button> : undefined}
                />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--space-16)' }}>
                    {evaluations.map((ev) => (
                        <div key={ev.id} style={{ backgroundColor: 'var(--background)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', borderTop: `4px solid ${getGradeColor(ev.final_grade)}`, padding: 'var(--space-24)', display: 'flex', flexDirection: 'column', gap: 'var(--space-16)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: 700, margin: '0 0 4px 0' }}>
                                        {ev.intern?.name || 'Intern Name'}
                                    </h3>
                                    <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Evaluator: <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{ev.mentor?.name || 'Mentor'}</span></p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <CircularProgress value={
                                        Math.round((ev.technical_score + ev.communication_score + ev.discipline_score + ev.problem_solving_score) / 4)
                                    } size={64} strokeWidth={6} color={getGradeVariant(ev.final_grade)} showValue />
                                    <Badge variant={getGradeVariant(ev.final_grade)} style={{ marginTop: '-8px', zIndex: 2 }}>Grade {ev.final_grade}</Badge>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
                                {Object.entries({
                                    Technical: ev.technical_score,
                                    Communication: ev.communication_score,
                                    Discipline: ev.discipline_score,
                                    'Prob. Solving': ev.problem_solving_score
                                }).map(([key, val]) => (
                                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-8) var(--space-12)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)' }}>
                                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{key}</span>
                                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>{val as number}</span>
                                    </div>
                                ))}
                            </div>

                            {ev.notes && (
                                <div style={{ padding: 'var(--space-12)', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-md)' }}>
                                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'block' }}>Mentor Notes</span>
                                    <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-main)', lineHeight: 1.5 }}>{ev.notes}</p>
                                </div>
                            )}
                            
                            <div style={{ marginTop: 'auto', paddingTop: 'var(--space-16)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 500 }}>
                                    {new Date(ev.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <Link to={`/reports/${ev.intern_id}`} style={{ textDecoration: 'none' }}>
                                    <Button variant="outline" size="sm" leftIcon={<Award size={14} />}>
                                        View Report
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Evaluation Progressive Drawer */}
            <Drawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)}
                title="New Evaluation Assessment"
                size="md"
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
                    
                    {/* Stepper Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: currentStep >= 1 ? 'var(--primary)' : 'var(--text-muted)' }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: currentStep >= 1 ? 'var(--primary)' : 'var(--border)', color: currentStep >= 1 ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>1</div>
                            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Intern</span>
                        </div>
                        <div style={{ flex: 1, height: 2, backgroundColor: currentStep >= 2 ? 'var(--primary)' : 'var(--border)', margin: '0 16px' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: currentStep >= 2 ? 'var(--primary)' : 'var(--text-muted)' }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: currentStep >= 2 ? 'var(--primary)' : 'var(--border)', color: currentStep >= 2 ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>2</div>
                            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Scores</span>
                        </div>
                        <div style={{ flex: 1, height: 2, backgroundColor: currentStep >= 3 ? 'var(--primary)' : 'var(--border)', margin: '0 16px' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: currentStep >= 3 ? 'var(--primary)' : 'var(--text-muted)' }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: currentStep >= 3 ? 'var(--primary)' : 'var(--border)', color: currentStep >= 3 ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>3</div>
                            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Review</span>
                        </div>
                    </div>

                    {currentStep === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                            <h3 style={{ fontSize: 'var(--font-size-h4)', fontWeight: 600, margin: 0 }}>Select Intern</h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', margin: 0 }}>Choose the intern you are evaluating for this period.</p>
                            
                            <Select 
                                value={formData.intern_id} 
                                onChange={(e) => setFormData({...formData, intern_id: e.target.value})} 
                                options={[
                                    { value: '', label: '-- Choose Intern --' },
                                    ...interns.map(i => ({ value: i.id, label: i.name }))
                                ]}
                            />
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
                            <div>
                                <h3 style={{ fontSize: 'var(--font-size-h4)', fontWeight: 600, margin: '0 0 4px 0' }}>Assessment Rubric</h3>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', margin: 0 }}>Score the intern on a scale of 0 to 100 for each category.</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: '8px' }}>Technical Skills</label>
                                    <Input type="number" min={0} max={100} value={formData.technical_score} onChange={(e) => setFormData({...formData, technical_score: Number(e.target.value)})} fullWidth />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: '8px' }}>Communication</label>
                                    <Input type="number" min={0} max={100} value={formData.communication_score} onChange={(e) => setFormData({...formData, communication_score: Number(e.target.value)})} fullWidth />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: '8px' }}>Discipline</label>
                                    <Input type="number" min={0} max={100} value={formData.discipline_score} onChange={(e) => setFormData({...formData, discipline_score: Number(e.target.value)})} fullWidth />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: '8px' }}>Problem Solving</label>
                                    <Input type="number" min={0} max={100} value={formData.problem_solving_score} onChange={(e) => setFormData({...formData, problem_solving_score: Number(e.target.value)})} fullWidth />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)', backgroundColor: 'var(--surface)', padding: 'var(--space-16)', borderRadius: 'var(--radius-lg)' }}>
                                <CircularProgress value={averageScore} size={80} strokeWidth={8} color={averageScore >= 85 ? 'success' : averageScore >= 75 ? 'primary' : 'warning'} showValue />
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: 'var(--font-size-h4)' }}>Average Score</h4>
                                    <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>This translates to a final grade of <strong>{averageScore >= 85 ? 'A' : averageScore >= 75 ? 'B' : averageScore >= 60 ? 'C' : 'D'}</strong>.</p>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: '8px' }}>Mentor Notes / Feedback (Optional)</label>
                                <textarea 
                                    className="ds-input" 
                                    rows={4} 
                                    value={formData.notes} 
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                                    placeholder="Provide constructive feedback for the intern..."
                                    style={{ width: '100%', padding: 'var(--space-12)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', resize: 'vertical' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--space-16)', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                        {currentStep > 1 ? (
                            <Button type="button" variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)}>Back</Button>
                        ) : (
                            <Button type="button" variant="ghost" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                        )}
                        
                        {currentStep < 3 ? (
                            <Button 
                                type="button" 
                                variant="primary" 
                                rightIcon={<ChevronRight size={16} />} 
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                disabled={currentStep === 1 && !formData.intern_id}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button type="submit" variant="primary" style={{ backgroundColor: 'var(--success)' }}>
                                Submit Evaluation
                            </Button>
                        )}
                    </div>
                </form>
            </Drawer>
        </div>
    );
};

export default Evaluation;
