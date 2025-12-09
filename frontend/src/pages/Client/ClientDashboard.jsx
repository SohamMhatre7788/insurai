import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientPolicyService, claimService } from '../../services';
import './ClientDashboard.css';

const ClientDashboard = () => {
    const [stats, setStats] = useState({
        totalPolicies: 0,
        activePolicies: 0,
        pendingClaims: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [policies, claims] = await Promise.all([
                    clientPolicyService.getMyPolicies(),
                    claimService.getMyClaims(),
                ]);

                setStats({
                    totalPolicies: policies.length,
                    activePolicies: policies.filter(p => p.status === 'ACTIVE').length,
                    pendingClaims: claims.filter(c => c.status === 'PENDING').length,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-container container">
            <div className="dashboard-header fade-in">
                <h1>Client Dashboard</h1>
                <p>Manage your insurance policies and claims</p>
            </div>

            <div className="stats-grid fade-in">
                <div className="stat-card card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                        <h3>{stats.totalPolicies}</h3>
                        <p>Total Policies</p>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3>{stats.activePolicies}</h3>
                        <p>Active Policies</p>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <h3>{stats.pendingClaims}</h3>
                        <p>Pending Claims</p>
                    </div>
                </div>
            </div>

            <div className="quick-actions fade-in">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/client/buy-policy" className="action-card card card-hover">
                        <div className="action-icon">🛒</div>
                        <h3>Buy New Policy</h3>
                        <p>Browse and purchase insurance policies</p>
                    </Link>

                    <Link to="/client/my-policies" className="action-card card card-hover">
                        <div className="action-icon">📄</div>
                        <h3>My Policies</h3>
                        <p>View and manage your policies</p>
                    </Link>

                    <Link to="/client/claim" className="action-card card card-hover">
                        <div className="action-icon">📝</div>
                        <h3>File a Claim</h3>
                        <p>Submit a new insurance claim</p>
                    </Link>

                    <Link to="/client/profile" className="action-card card card-hover">
                        <div className="action-icon">👤</div>
                        <h3>Profile Settings</h3>
                        <p>Update your account information</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
