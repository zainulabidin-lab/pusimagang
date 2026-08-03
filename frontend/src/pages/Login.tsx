import React, { useState } from 'react';
import { Network } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/login', { email, password });
            login(response.data.data.access_token, response.data.data.user);
        } catch (err: any) {
            const specificError = err.response?.data?.errors?.email?.[0];
            setError(specificError || err.response?.data?.message || 'Login failed (Pastikan server menyala dan email/password benar)');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', backgroundColor: '#EFF6FF', color: 'var(--primary)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                        <Network size={28} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>PUSIM Magang</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Sign in to your account</p>
                </div>
                
                {error && <div style={{ backgroundColor: '#FEE2E2', color: '#EF4444', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            className="input-control" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            className="input-control" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Sign In
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Belum punya akun? <a href="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Daftar di sini</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
