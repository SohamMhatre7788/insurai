import { useState, useEffect } from 'react';
import { adminService } from '../../services';
import '../Client/MyPolicies.css';

const ManagePolicies = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const data = await adminService.getAllPolicies();
            setPolicies(data);
        } catch (err) {
            setError('Failed to load policies');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (policyId) => {
        if (!window.confirm('Are you sure you want to delete this policy?')) {
            return;
        }

        try {
            await adminService.deletePolicy(policyId);
            fetchPolicies();
            alert('Policy deleted successfully!');
        } catch (err) {
            alert('Failed to delete policy');
        }
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="my-policies-container container">
            <div className="page-header">
                <h1 className="page-title fade-in">Manage Policies</h1>
                <a href="/admin/create-policy" className="btn btn-primary">
                    Create New Policy
                </a>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="policies-table-container card fade-in">
                <table className="policies-table">
                    <thead>
                        <tr>
                            <th>Policy Name</th>
                            <th>Premium/Year</th>
                            <th>Coverage</th>
                            <th>Risk Level</th>
                            <th>Period Range</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map((policy) => (
                            <tr key={policy.id}>
                                <td>{policy.name}</td>
                                <td>${policy.premiumPerYear.toLocaleString()}</td>
                                <td>${policy.coverageAmount.toLocaleString()}</td>
                                <td>
                                    <span className={`badge badge-${policy.riskLevel.toLowerCase()}`}>
                                        {policy.riskLevel}
                                    </span>
                                </td>
                                <td>{policy.minPeriodYears}-{policy.maxPeriodYears} years</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {policy.policyDocumentUrl && (
                                            <a
                                                href={policy.policyDocumentUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-secondary"
                                            >
                                                View Doc
                                            </a>
                                        )}
                                        <button
                                            onClick={() => handleDelete(policy.id)}
                                            className="btn btn-sm btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagePolicies;
