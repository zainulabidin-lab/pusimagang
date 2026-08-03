import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight, ChevronLeft, Flag } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Option {
    id: number;
    question_bank_id: number;
    option_text: string;
}

interface Question {
    id: number;
    question_text: string;
    options: Option[];
}

const PreTestSession: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [attemptId, setAttemptId] = useState<number | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({}); // question_id -> option_id
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const startTest = async () => {
            try {
                const res = await api.get('/competency/pre-test/start');
                setAttemptId(res.data.data.attempt_id);
                setQuestions(res.data.data.questions);
            } catch (err: any) {
                if (err.response && err.response.status === 400) {
                    navigate('/'); // Already completed
                } else {
                    setError('Gagal memuat ujian. Silakan coba lagi.');
                }
            } finally {
                setLoading(false);
            }
        };
        startTest();
    }, [navigate]);

    const handleOptionSelect = (questionId: number, optionId: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = async () => {
        if (!attemptId) return;

        // Check if all answered
        if (Object.keys(answers).length < questions.length) {
            if (!confirm('Anda belum menjawab semua pertanyaan. Yakin ingin mengakhiri ujian?')) {
                return;
            }
        } else {
            if (!confirm('Apakah Anda yakin ingin mengumpulkan jawaban ini?')) {
                return;
            }
        }

        setSubmitting(true);
        try {
            const payload = {
                answers: Object.entries(answers).map(([qId, oId]) => ({
                    question_bank_id: parseInt(qId),
                    question_option_id: oId
                }))
            };
            const res = await api.post(`/competency/pre-test/${attemptId}/submit`, payload);
            
            // Redirect to result page
            navigate('/competency/pre-test/result', { state: { score: res.data.data.score } });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal mengirim jawaban.');
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner message="Menyiapkan soal ujian..." />;
    if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: '#EF4444' }}>{error}</div>;
    if (questions.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Tidak ada soal yang tersedia.</div>;

    const currentQuestion = questions[currentIndex];
    const isAnswered = (index: number) => answers[questions[index].id] !== undefined;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border)', padding: isMobile ? '1rem' : '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: isMobile ? '1.1rem' : '1.25rem', fontWeight: 600 }}>Pre-Test Kompetensi</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Soal {currentIndex + 1} / {questions.length}</span>
                    <button 
                        onClick={handleSubmit} 
                        disabled={submitting}
                        className="btn btn-primary" 
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        {submitting ? 'Mengirim...' : 'Selesai'}
                    </button>
                </div>
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: isMobile ? 'column' : 'row' }}>
                {/* Main Content (Question) */}
                <div style={{ flex: 1, padding: isMobile ? '1rem' : '2rem', overflowY: 'auto' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="card" style={{ padding: isMobile ? '1.5rem 1rem' : '2rem', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                Pertanyaan {currentIndex + 1}
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.6, marginBottom: '2rem' }}>
                                {currentQuestion.question_text}
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {currentQuestion.options.map((opt, idx) => {
                                    const isSelected = answers[currentQuestion.id] === opt.id;
                                    const labels = ['A', 'B', 'C', 'D', 'E'];
                                    return (
                                        <div 
                                            key={opt.id}
                                            onClick={() => handleOptionSelect(currentQuestion.id, opt.id)}
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '1rem', 
                                                padding: '1rem', 
                                                border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`, 
                                                borderRadius: 'var(--radius-md)',
                                                backgroundColor: isSelected ? '#EFF6FF' : 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ 
                                                width: '32px', height: '32px', 
                                                borderRadius: '50%', 
                                                backgroundColor: isSelected ? 'var(--primary)' : '#F3F4F6',
                                                color: isSelected ? 'white' : 'var(--text-main)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 600
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

                        {/* Navigation */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button 
                                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentIndex === 0}
                                className="btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <ChevronLeft size={20} /> Sebelumnya
                            </button>
                            <button 
                                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                disabled={currentIndex === questions.length - 1}
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                Selanjutnya <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Navigation (Grid) */}
                <div style={{ width: isMobile ? '100%' : '300px', backgroundColor: 'white', borderLeft: isMobile ? 'none' : '1px solid var(--border)', borderTop: isMobile ? '1px solid var(--border)' : 'none', padding: '1.5rem', overflowY: 'auto' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Navigasi Soal</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                        {questions.map((q, idx) => {
                            const answered = isAnswered(idx);
                            const active = currentIndex === idx;
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentIndex(idx)}
                                    style={{
                                        aspectRatio: '1',
                                        borderRadius: 'var(--radius-sm)',
                                        border: `2px solid ${active ? 'var(--primary)' : (answered ? '#10B981' : 'var(--border)')}`,
                                        backgroundColor: active ? 'var(--primary)' : (answered ? '#D1FAE5' : 'white'),
                                        color: active ? 'white' : (answered ? '#047857' : 'var(--text-main)'),
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                    
                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '16px', height: '16px', backgroundColor: '#D1FAE5', border: '2px solid #10B981', borderRadius: '4px' }}></div>
                            Sudah Dijawab
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '16px', height: '16px', backgroundColor: 'white', border: '2px solid var(--border)', borderRadius: '4px' }}></div>
                            Belum Dijawab
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreTestSession;
