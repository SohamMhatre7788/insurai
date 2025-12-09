import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Client Pages
import ClientDashboard from './pages/Client/ClientDashboard';
import BuyPolicy from './pages/Client/BuyPolicy';
import MyPolicies from './pages/Client/MyPolicies';
import ClaimPolicies from './pages/Client/ClaimPolicies';
import Profile from './pages/Client/Profile';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import CreatePolicy from './pages/Admin/CreatePolicy';
import ManagePolicies from './pages/Admin/ManagePolicies';
import ManageClaims from './pages/Admin/ManageClaims';
import ManageClients from './pages/Admin/ManageClients';

import './styles/index.css';

const AppRoutes = () => {
    const { isAuthenticated, isClient, isAdmin } = useAuth();

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Public Routes */}
                <Route
                    index
                    element={
                        isAuthenticated ? (
                            isClient ? (
                                <Navigate to="/client" replace />
                            ) : isAdmin ? (
                                <Navigate to="/admin" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />

                {/* Client Routes */}
                <Route
                    path="client"
                    element={
                        <ProtectedRoute requiredRole="CLIENT">
                            <ClientDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="client/buy-policy"
                    element={
                        <ProtectedRoute requiredRole="CLIENT">
                            <BuyPolicy />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="client/my-policies"
                    element={
                        <ProtectedRoute requiredRole="CLIENT">
                            <MyPolicies />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="client/claim"
                    element={
                        <ProtectedRoute requiredRole="CLIENT">
                            <ClaimPolicies />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="client/profile"
                    element={
                        <ProtectedRoute requiredRole="CLIENT">
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="admin"
                    element={
                        <ProtectedRoute requiredRole="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admin/create-policy"
                    element={
                        <ProtectedRoute requiredRole="ADMIN">
                            <CreatePolicy />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admin/policies"
                    element={
                        <ProtectedRoute requiredRole="ADMIN">
                            <ManagePolicies />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admin/claims"
                    element={
                        <ProtectedRoute requiredRole="ADMIN">
                            <ManageClaims />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admin/clients"
                    element={
                        <ProtectedRoute requiredRole="ADMIN">
                            <ManageClients />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
