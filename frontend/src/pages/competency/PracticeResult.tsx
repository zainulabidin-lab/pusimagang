import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, ArrowRight, Activity, XCircle, CheckCircle } from 'lucide-react';

const PracticeResult: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    if (!location.state || !location.state.result) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Data hasil latihan tidak ditemukan.</div>;
    }

    const { result, questions, userAnswers } = location.state;
    const { score, xp_gained, feedbacks } = result;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', backgroundColor: '#ECFDF5', color: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={40} />
                </div>
                
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Latihan Selesai!</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Hebat! Latihan terus untuk meningkatkan kemampuanmu.</p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <div style={{ padding: '1.5rem', backgroundColor: '#F9FAFB', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', minWidth: '150px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Skor</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: score >= 70 ? '#10B981' : '#F59E0B' }}>{Math.round(score)}%</div>
                    </div>
                    <div style={{ padding: '1.5rem', backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-md)', border: '1px solid #FDE68A', minWidth: '150px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>XP Didapat</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Activity size={24} /> +{xp_gained}
                        </div>
                    </div>
                </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Review Jawaban</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {feedbacks.map((fb: any, index: number) => {
                    const q = questions.find((q: any) => q.id === fb.question_bank_id);
                    if (!q) return null;
                    
                    return (
                        <div key={fb.question_bank_id} className="card" style={{ borderLeft: `4px solid ${fb.is_correct ? '#10B981' : '#EF4444'}` }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                {fb.is_correct ? <CheckCircle color="#10B981" /> : <XCircle color="#EF4444" />}
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{index + 1}. {q.question_text}</div>
                                    {!fb.is_correct && (
                                        <div style={{ fontSize: '0.875rem', color: '#EF4444', backgroundColor: '#FEF2F2', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
                                            <strong>Jawabanmu:</strong> {q.options.find((o: any) => o.id === userAnswers[q.id])?.option_text || 'Kosong'}
                                        </div>
                                    )}
                                    <div style={{ fontSize: '0.875rem', color: '#10B981', backgroundColor: '#ECFDF5', padding: '0.5rem', borderRadius: '4px' }}>
                                        <strong>Kunci Jawaban:</strong> {q.options.find((o: any) => o.id === fb.correct_option_id)?.option_text || 'Error'}
                                    </div>
                                    {fb.explanation && (
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                            💡 {fb.explanation}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button 
                onClick={() => navigate('/competency/practice')} 
                className="btn btn-outline" 
                style={{ width: '100%', padding: '1rem', marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
            >
                Kembali ke Menu Latihan <ArrowRight size={20} />
            </button>
        </div>
    );
};

export default PracticeResult;
