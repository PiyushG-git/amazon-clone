import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all required fields.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (!isLogin && !name.trim()) {
            setError('Please enter your name.');
            return;
        }
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (loginMode) => {
        setIsLogin(loginMode);
        setError('');
        setName(''); setEmail(''); setPassword('');
    };

    return (
        <div className="auth-page" style={{ paddingTop: 40 }}>
            <Link to="/">
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f1111', marginBottom: 20, letterSpacing: -1 }}>amazon</div>
            </Link>

            <div className="auth-card">
                <h1 className="auth-title">{isLogin ? 'Sign in' : 'Create account'}</h1>

                {error && <div className="auth-error">⚠️ {error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="auth-field">
                            <label htmlFor="name">Your name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="First and last name"
                                autoComplete="name"
                            />
                        </div>
                    )}

                    <div className="auth-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder={isLogin ? 'Enter your password' : 'At least 6 characters'}
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                            />
                            <button type="button" className="password-toggle" onClick={() => setShowPassword(s => !s)}>
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: 8 }}
                    >
                        {loading
                            ? <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #0f1111', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
                                {isLogin ? 'Signing in…' : 'Creating account…'}
                              </span>
                            : isLogin ? 'Continue' : 'Create your Amazon account'
                        }
                    </button>

                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </form>

                {isLogin && (
                    <div style={{ fontSize: 12, color: '#565959', marginTop: 16 }}>
                        By continuing, you agree to Amazon Clone's <span style={{ color: '#007185' }}>Conditions of Use</span> and <span style={{ color: '#007185' }}>Privacy Notice</span>.
                    </div>
                )}

                <hr className="auth-divider" />

                {isLogin ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 14, color: '#565959', marginBottom: 10 }}>New to Amazon?</div>
                        <button
                            className="btn"
                            style={{ width: '100%', border: '1px solid #d5d9d9', background: '#f0f2f2', borderRadius: 8, padding: '9px' }}
                            onClick={() => switchMode(false)}
                        >
                            Create your Amazon account
                        </button>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', fontSize: 14 }}>
                        Already have an account?{' '}
                        <span style={{ color: '#007185', cursor: 'pointer' }} onClick={() => switchMode(true)}>
                            Sign in
                        </span>
                    </div>
                )}
            </div>

            <div style={{ fontSize: 12, color: '#565959', textAlign: 'center', marginTop: 24, display: 'flex', gap: 16, justifyContent: 'center' }}>
                <span style={{ color: '#007185' }}>Conditions of Use</span>
                <span style={{ color: '#007185' }}>Privacy Notice</span>
                <span style={{ color: '#007185' }}>Help</span>
            </div>
        </div>
    );
};

export default Auth;
