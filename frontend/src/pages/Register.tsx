import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Network, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StepProgress } from '../components/ui/Progress';
import { Alert } from '../components/ui/Alert';

const Register: React.FC = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [majorName, setMajorName] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (step < 3) {
            if (step === 1 && (!name || !email || !password)) {
                setError('Mohon lengkapi semua data akun.');
                return;
            }
            if (step === 2 && (!schoolName || !majorName)) {
                setError('Mohon pilih asal sekolah dan jurusan.');
                return;
            }
            setError('');
            setStep(prev => prev + 1);
            return;
        }

        setError('');
        setIsSubmitting(true);
        try {
            const response = await api.post('/register', { 
                name, 
                email, 
                password, 
                school_name: schoolName, 
                major_name: majorName  
            });
            setSuccess(response.data.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            const specificError = Object.values(err.response?.data?.errors || {}).flat()[0] as string;
            setError(specificError || err.response?.data?.message || 'Registrasi gagal. Silakan periksa kembali data Anda.');
            setIsSubmitting(false);
        }
    };

    const getWizardSteps = () => {
        return [
            { label: 'Akun', status: step > 1 ? 'complete' : 'current' as any },
            { label: 'Edukasi', status: step > 2 ? 'complete' : step === 2 ? 'current' : 'upcoming' as any },
            { label: 'Konfirmasi', status: step === 3 ? 'current' : 'upcoming' as any }
        ];
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)', padding: 'var(--space-24)' }}>
            <div style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', margin: '0 auto var(--space-16)' }}>
                        <Network size={24} strokeWidth={2.5} />
                    </div>
                    <h1 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 700, margin: '0 0 var(--space-8) 0' }}>Daftar Magang</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>Lengkapi profil Anda untuk bergabung dengan PUSIM Magang.</p>
                </div>

                <div className="card" style={{ padding: 'var(--space-32)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                    <div style={{ marginBottom: 'var(--space-32)' }}>
                        <StepProgress steps={getWizardSteps()} />
                    </div>

                    {error && <div style={{ marginBottom: 'var(--space-16)' }}><Alert variant="danger" title="Gagal">{error}</Alert></div>}
                    {success && <div style={{ marginBottom: 'var(--space-16)' }}><Alert variant="success" title="Berhasil">{`${success} (Otomatis dialihkan...)`}</Alert></div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                        {step === 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Nama Lengkap</label>
                                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan nama Anda" fullWidth />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Email</label>
                                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@contoh.com" fullWidth />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Password</label>
                                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" fullWidth />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Asal Sekolah / Universitas</label>
                                    <Input 
                                        value={schoolName} 
                                        onChange={(e) => setSchoolName(e.target.value)}
                                        placeholder="Contoh: SMK Telkom Malang"
                                        fullWidth
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Jurusan</label>
                                    <Input 
                                        value={majorName} 
                                        onChange={(e) => setMajorName(e.target.value)}
                                        placeholder="Contoh: Rekayasa Perangkat Lunak"
                                        fullWidth
                                    />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div style={{ backgroundColor: 'var(--surface)', padding: 'var(--space-24)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-12)' }}>
                                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle size={32} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 'var(--font-size-h4)', fontWeight: 600, margin: '0 0 var(--space-8) 0' }}>Siap Mendaftar!</h3>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', margin: 0 }}>Pastikan data yang Anda masukkan sudah benar.</p>
                                </div>
                                
                                <div style={{ width: '100%', textAlign: 'left', marginTop: 'var(--space-12)', backgroundColor: 'var(--surface-hover)', padding: 'var(--space-12)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Nama:</span>
                                        <span style={{ fontWeight: 500 }}>{name}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                                        <span style={{ fontWeight: 500 }}>{email}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Sekolah:</span>
                                        <span style={{ fontWeight: 500 }}>{schoolName}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div style={{ display: 'flex', gap: 'var(--space-12)', marginTop: 'var(--space-16)' }}>
                            {step > 1 && (
                                <Button type="button" variant="outline" onClick={() => setStep(prev => prev - 1)} style={{ flex: 1 }} disabled={isSubmitting || !!success}>
                                    Kembali
                                </Button>
                            )}
                            <Button type="submit" variant="primary" style={{ flex: step > 1 ? 2 : 1 }} disabled={isSubmitting || !!success} rightIcon={step < 3 ? <ChevronRight size={16} /> : undefined}>
                                {step < 3 ? 'Selanjutnya' : isSubmitting ? 'Memproses...' : 'Daftar Sekarang'}
                            </Button>
                        </div>

                        {!success && (
                            <div style={{ textAlign: 'center', marginTop: 'var(--space-16)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
                                Sudah punya akun? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Masuk di sini</Link>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
