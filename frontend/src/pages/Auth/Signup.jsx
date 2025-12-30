import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services';
import './Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPassword: false,
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isFirstNameValid = formData.firstName.trim().length > 0;
    const isLastNameValid = formData.lastName.trim().length > 0;
    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = formData.password.length >= 6;
    const isConfirmValid = formData.confirmPassword === formData.password && isPasswordValid;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };
    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...signupData } = formData;
            const response = await authService.signup(signupData);
            login(response);
            navigate('/client'); // New users are always clients
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
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

            <div className="auth-card card fade-in">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join Insurai and protect your business</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="input-row">
                        <div className="input-group">
                            <label className="input-label">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={touched.firstName && !isFirstNameValid}
                                aria-describedby="firstName-error"
                                className={`input-field ${touched.firstName ? (isFirstNameValid ? 'valid' : 'invalid') : ''}`}
                                placeholder="John"
                                required
                            />
                            {touched.firstName && !isFirstNameValid && (
                                <div id="firstName-error" className="error-message">First name is required</div>
                            )}
                        </div>

                        <div className="input-group">
                            <label className="input-label">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={touched.lastName && !isLastNameValid}
                                aria-describedby="lastName-error"
                                className={`input-field ${touched.lastName ? (isLastNameValid ? 'valid' : 'invalid') : ''}`}
                                placeholder="Doe"
                                required
                            />
                            {touched.lastName && !isLastNameValid && (
                                <div id="lastName-error" className="error-message">Last name is required</div>
                            )}
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={touched.email && !isEmailValid}
                            aria-describedby="email-error"
                            className={`input-field ${touched.email ? (isEmailValid ? 'valid' : 'invalid') : ''}`}
                            placeholder="you@company.com"
                            required
                        />
                        {touched.email && !isEmailValid && (
                            <div id="email-error" className="error-message">Enter a valid email address</div>
                        )}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={touched.password && !isPasswordValid}
                            aria-describedby="password-error"
                            className={`input-field ${touched.password ? (isPasswordValid ? 'valid' : 'invalid') : ''}`}
                            placeholder="••••••••"
                            required
                        />
                        {touched.password && !isPasswordValid && (
                            <div id="password-error" className="error-message">Minimum 6 characters</div>
                        )}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={touched.confirmPassword && !isConfirmValid}
                            aria-describedby="confirm-error"
                            className={`input-field ${touched.confirmPassword ? (isConfirmValid ? 'valid' : 'invalid') : ''}`}
                            placeholder="••••••••"
                            required
                        />
                        {touched.confirmPassword && !isConfirmValid && (
                            <div id="confirm-error" className="error-message">Passwords must match</div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
