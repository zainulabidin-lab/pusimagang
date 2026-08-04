import React, { useState } from 'react';
import { Network, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await api.post('/login', { email, password });
            login(response.data.data.access_token, response.data.data.user);
        } catch (err: any) {
            const specificError = err.response?.data?.errors?.email?.[0];
            setError(specificError || err.response?.data?.message || 'Login failed (Pastikan server menyala dan email/password benar)');
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)', padding: 'var(--space-24)' }}>
            <div style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', margin: '0 auto var(--space-16)' }}>
                        <Network size={24} strokeWidth={2.5} />
                    </div>
                    <h1 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 700, margin: '0 0 var(--space-8) 0' }}>PUSIM Magang</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>Sign in to your account</p>
                </div>
                
                <div className="card" style={{ padding: 'var(--space-32)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                    {error && (
                        <div style={{ marginBottom: 'var(--space-16)' }}>
                            <Alert variant="danger" title="Gagal">{error}</Alert>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Email Address</label>
                            <Input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="nama@email.com"
                                required 
                                fullWidth
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Password</label>
                            <Input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="••••••••"
                                required 
                                fullWidth
                            />
                        </div>
                        
                        <div style={{ marginTop: 'var(--space-8)' }}>
                            <Button 
                                type="submit" 
                                variant="primary" 
                                style={{ width: '100%', justifyContent: 'center' }} 
                                disabled={isLoading}
                                rightIcon={<LogIn size={18} />}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: 'var(--space-16)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
                            Belum punya akun? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Daftar di sini</Link>
                        </div>
                    </form>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: 'var(--space-24)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                    &copy; {new Date().getFullYear()} Pusat Teknologi dan Sistem Informasi (PUSIM). All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Login;
