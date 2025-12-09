import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on role
        if (user?.role === 'CLIENT') {
            return <Navigate to="/client" replace />;
        } else if (user?.role === 'ADMIN') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
