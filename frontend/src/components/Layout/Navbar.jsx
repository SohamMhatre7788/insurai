import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
import ThemeToggle from '../Common/ThemeToggle';

const Navbar = () => {
    const { user, isAuthenticated, isClient, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🛡️</span>
                    <span className="logo-text">Insurai</span>
                </Link>

                <div className="navbar-links">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/signup" className="nav-link btn-primary">Sign Up</Link>
                        </>
                    ) : isClient ? (
                        <>
                            <Link to="/client" className="nav-link">Dashboard</Link>
                            <Link to="/client/buy-policy" className="nav-link">Buy Policy</Link>
                            <Link to="/client/my-policies" className="nav-link">My Policies</Link>
                            <Link to="/client/claim" className="nav-link">File Claim</Link>
                            <Link to="/client/profile" className="nav-link">Profile</Link>
                            <div className="nav-user">
                                <span className="user-name">{user?.firstName}</span>
                                <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                            </div>
                        </>
                    ) : isAdmin ? (
                        <>
                            <Link to="/admin" className="nav-link">Dashboard</Link>
                            <Link to="/admin/create-policy" className="nav-link">Create Policy</Link>
                            <Link to="/admin/policies" className="nav-link">Manage Policies</Link>
                            <Link to="/admin/claims" className="nav-link">Manage Claims</Link>
                            <Link to="/admin/clients" className="nav-link">Manage Clients</Link>
                            <div className="nav-user">
                                <span className="user-name">{user?.firstName}</span>
                                <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                            </div>
                        </>
                    ) : null}
                </div>
                <ThemeToggle />
            </div>
        </nav>
    );
};

export default Navbar;
