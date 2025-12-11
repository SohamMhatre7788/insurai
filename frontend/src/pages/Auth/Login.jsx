import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(formData);
            login(response);

            // Redirect based on role
            if (response.role === 'CLIENT') {
                navigate('/client');
            } else if (response.role === 'ADMIN') {
                navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            
                <div className="auth-card card">
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 p-8 text-white">
                        <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">
                            InsurAI
                        </p>
                        <h2 className="mt-6 text-3xl font-semibold leading-tight">
                            Corporate Policy Automation System
                        </h2>
                        <p className="mt-4 text-sm text-indigo-100">
                            Securely create, validate, and manage AI-assisted policies in one
                            corporate-grade workspace.
                        </p>
                        <ul className="mt-10 space-y-4 text-sm text-indigo-50">
                            <li> AI-generated drafts tailored for enterprises.</li>
                            <li> Compliance insights and renewal tracking.</li>
                            <li> Encrypted JWT authentication, Bcrypt passwords and secure uploads.</li>
                        </ul>
                    </div>
                    </div>
                    
                    <div className="auth-card card">
                        <div className="auth-header">
                            <h1>Welcome Back</h1>
                            <p>Sign in to your Insurai account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {error && <div className="error-message">{error}</div>}

                            <div className="input-group">
                                <label className="input-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>
                                Don't have an account? <Link to="/signup">Sign up</Link>
                            </p>
                        </div>
                    </div>
                </div>
                );
};

                export default Login;
