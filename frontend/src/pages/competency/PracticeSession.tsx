import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import api from '../../services/api';

const PracticeSession: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [submitting, setSubmitting] = useState(false);
    const [attemptId, setAttemptId] = useState<number | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    useEffect(() => {
        if (!location.state || !location.state.attemptId) {
            navigate('/competency/practice');
            return;
        }
        setAttemptId(location.state.attemptId);
        setQuestions(location.state.questions);
    }, [location, navigate]);

    const handleOptionSelect = (questionId: number, optionId: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = async () => {
        if (!attemptId) return;

        if (Object.keys(answers).length < questions.length) {
            if (!confirm('Anda belum menjawab semua pertanyaan. Yakin ingin mengumpulkan?')) return;
        }

        setSubmitting(true);
        try {
            const payload = {
                answers: Object.entries(answers).map(([qId, oId]) => ({
                    question_bank_id: parseInt(qId),
                    question_option_id: oId
                }))
            };
            const res = await api.post(`/competency/practice/${attemptId}/submit`, payload);
            
            navigate('/competency/practice/result', { 
                state: { 
                    result: res.data.data,
                    questions: questions,
                    userAnswers: answers
                } 
            });
        } catch (err: any) {
            alert(err.response?.data?.message || 'Gagal mengirim jawaban.');
            setSubmitting(false);
        }
    };

    if (questions.length === 0) return null;

    const currentQuestion = questions[currentIndex];
    const isAnswered = (index: number) => answers[questions[index].id] !== undefined;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem', padding: isMobile ? '0 1rem' : '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', marginTop: isMobile ? '1rem' : '0' }}>
                <h1 style={{ fontSize: isMobile ? '1.1rem' : '1.25rem', fontWeight: 600 }}>Latihan Soal</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Soal {currentIndex + 1} / {questions.length}</span>
                    <button onClick={handleSubmit} disabled={submitting} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                        {submitting ? 'Mengirim...' : 'Selesai Latihan'}
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: isMobile ? '1.5rem 1rem' : '2rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: isMobile ? '1.1rem' : '1.25rem', fontWeight: 500, lineHeight: 1.6, marginBottom: '2rem' }}>
                    {currentQuestion.question_text}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {currentQuestion.options.map((opt: any, idx: number) => {
                        const isSelected = answers[currentQuestion.id] === opt.id;
                        const labels = ['A', 'B', 'C', 'D', 'E'];
                        return (
                            <div 
                                key={opt.id}
                                onClick={() => handleOptionSelect(currentQuestion.id, opt.id)}
                                style={{ 
                                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`, 
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: isSelected ? '#EFF6FF' : 'white',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ 
                                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                                    backgroundColor: isSelected ? 'var(--primary)' : '#F3F4F6',
                                    color: isSelected ? 'white' : 'var(--text-main)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600
                                }}>
                                    {labels[idx] || idx+1}
                                </div>
                                <div style={{ fontSize: '1rem', flex: 1 }}>{opt.option_text}</div>
                                {isSelected && <CheckCircle size={24} color="var(--primary)" />}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <button 
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="btn btn-outline"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: isMobile ? '0.5rem' : '0.5rem 1rem' }}
                >
                    <ChevronLeft size={20} /> {!isMobile && 'Sebelumnya'}
                </button>

                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
                    {questions.map((_, idx) => (
                        <div key={idx} style={{ width: isMobile ? '8px' : '12px', height: isMobile ? '8px' : '12px', borderRadius: '50%', backgroundColor: isAnswered(idx) ? 'var(--primary)' : 'var(--border)' }}></div>
                    ))}
                </div>

                <button 
                    onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentIndex === questions.length - 1}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: isMobile ? '0.5rem' : '0.5rem 1rem' }}
                >
                    {!isMobile && 'Selanjutnya'} <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default PracticeSession;
