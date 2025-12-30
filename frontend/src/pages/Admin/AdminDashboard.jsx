import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services';
import '../Client/ClientDashboard.css';
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalPolicies: 0,
        totalClients: 0,
        pendingClaims: 0,
    });
    const [loading, setLoading] = useState(true);
const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [policies, clients, claims] = await Promise.all([
                    adminService.getAllPolicies(),
                    adminService.getAllClients(),
                    adminService.getAllClaims('PENDING'),
                ]);

                setStats({
                    totalPolicies: policies.length,
                    totalClients: clients.length,
                    pendingClaims: claims.length,
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
                <h1>Admin Dashboard</h1>
                <p>Manage policies, claims, and clients</p>
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
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>{stats.totalClients}</h3>
                        <p>Total Clients</p>
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
                    <Link to="/admin/create-policy" className="action-card card card-hover">
                        <div className="action-icon">➕</div>
                        <h3>Create Policy</h3>
                        <p>Add new insurance policy</p>
                    </Link>

                    <Link to="/admin/policies" className="action-card card card-hover">
                        <div className="action-icon">📄</div>
                        <h3>Manage Policies</h3>
                        <p>View and update policies</p>
                    </Link>

                    <Link to="/admin/claims" className="action-card card card-hover">
                        <div className="action-icon">📝</div>
                        <h3>Manage Claims</h3>
                        <p>Review and process claims</p>
                    </Link>

                    <Link to="/admin/clients" className="action-card card card-hover">
                        <div className="action-icon">👤</div>
                        <h3>Manage Clients</h3>
                        <p>View and manage client accounts</p>
                    </Link>
                </div>
            </div>
  <button
  className="ai-fab"
  onClick={() => navigate("/admin/corporate-ai")}
  title="Corporate AI Assistant"
>
  🤖
</button>

        </div>
    );
};

export default AdminDashboard;
