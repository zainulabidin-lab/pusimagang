import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Plus, X } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

const Practice: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [questionText, setQuestionText] = useState('');
    const [explanation, setExplanation] = useState('');
    const [options, setOptions] = useState([
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false }
    ]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/competency/practice/categories');
            setCategories(res.data.data);
        } catch (err) {
            console.error("Failed to load practice categories", err);
        } finally {
            setLoading(false);
        }
    };

    const startPractice = async (categoryId: number) => {
        try {
            const res = await api.post('/competency/practice/start', { category_id: categoryId });
            navigate('/competency/practice/session', { state: { attemptId: res.data.data.attempt_id, questions: res.data.data.questions } });
        } catch (err) {
            console.error("Failed to start practice", err);
            alert("Gagal memulai latihan. Silakan coba lagi.");
        }
    };

    const openAddQuestionModal = (category: any) => {
        setSelectedCategory(category);
        setQuestionText('');
        setExplanation('');
        setOptions([
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false }
        ]);
        setShowModal(true);
    };

    const handleOptionChange = (index: number, field: string, value: any) => {
        const newOptions = [...options];
        if (field === 'is_correct') {
            // Uncheck others if this one is checked (single correct answer)
            newOptions.forEach(opt => opt.is_correct = false);
            newOptions[index].is_correct = true;
        } else {
            newOptions[index].text = value;
        }
        setOptions(newOptions);
    };

    const submitQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        const hasCorrect = options.some(opt => opt.is_correct);
        if (!hasCorrect) {
            alert("Silakan pilih salah satu opsi sebagai jawaban benar!");
            return;
        }
        if (options.some(opt => !opt.text.trim())) {
            alert("Semua teks opsi jawaban harus diisi!");
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/competency/practice/questions', {
                category_id: selectedCategory.id,
                question_text: questionText,
                explanation: explanation,
                options: options
            });
            alert("Soal berhasil ditambahkan!");
            setShowModal(false);
            fetchCategories(); // Refresh counts
        } catch (err: any) {
            console.error("Failed to add question", err);
            alert(err.response?.data?.message || "Gagal menambahkan soal.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner message="Memuat kategori latihan..." />;

    const isAdminOrMentor = user?.role === 'admin' || user?.role === 'mentor';

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {isAdminOrMentor ? 'Manajemen Bank Soal (Latihan)' : 'Latihan Soal (Practice)'}
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    {isAdminOrMentor 
                        ? 'Kelola dan tambahkan soal-soal latihan untuk mengasah kemampuan anak magang.' 
                        : 'Asah kemampuanmu dengan mengerjakan latihan soal per kategori. Dapatkan XP tambahan!'}
                </p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {categories.map(cat => (
                    <div key={cat.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', flex: 1 }}>
                            <div style={{ padding: '1rem', backgroundColor: '#EFF6FF', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>{cat.name}</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{cat.question_banks_count} Soal Tersedia</p>
                            </div>
                        </div>
                        {isAdminOrMentor ? (
                            <button 
                                onClick={() => openAddQuestionModal(cat)}
                                className="btn btn-primary"
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <Plus size={16} /> Tambah Soal
                            </button>
                        ) : (
                            <button 
                                onClick={() => startPractice(cat.id)}
                                className="btn btn-outline"
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                Mulai Latihan <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Question Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Tambah Soal - {selectedCategory?.name}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={submitQuestion}>
                            <div className="form-group">
                                <label className="form-label">Teks Pertanyaan</label>
                                <textarea 
                                    className="form-input" 
                                    rows={3} 
                                    required 
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                    placeholder="Tuliskan pertanyaan di sini..."
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label">Pilihan Jawaban (Pilih satu yang benar)</label>
                                {options.map((opt, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                        <input 
                                            type="radio" 
                                            name="correct_option"
                                            checked={opt.is_correct}
                                            onChange={() => handleOptionChange(idx, 'is_correct', true)}
                                            style={{ width: '20px', height: '20px' }}
                                        />
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            placeholder={`Opsi ${idx + 1}`} 
                                            value={opt.text}
                                            onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Penjelasan (Opsional)</label>
                                <textarea 
                                    className="form-input" 
                                    rows={2} 
                                    value={explanation}
                                    onChange={(e) => setExplanation(e.target.value)}
                                    placeholder="Penjelasan jika jawaban benar/salah (muncul saat review)"
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Batal</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Menyimpan...' : 'Simpan Soal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Practice;
