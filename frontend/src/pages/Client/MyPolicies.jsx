import { useState, useEffect } from 'react';
import { clientPolicyService } from '../../services';
import './MyPolicies.css';

const MyPolicies = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const data = await clientPolicyService.getMyPolicies();
            setPolicies(data);
        } catch (err) {
            setError('Failed to load policies');
        } finally {
            setLoading(false);
        }
    };

    const handleRenew = async (policyId) => {
        try {
            await clientPolicyService.renewPolicy(policyId);
            fetchPolicies(); // Refresh the list
            alert('Policy renewed successfully!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to renew policy');
        }
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="my-policies-container container">
            <h1 className="page-title fade-in">My Policies</h1>

            {error && <div className="error-message">{error}</div>}

            {policies.length === 0 ? (
                <div className="empty-state card">
                    <p>You don't have any policies yet.</p>
                    <a href="/client/buy-policy" className="btn btn-primary">Buy Your First Policy</a>
                </div>
            ) : (
                <div className="policies-table-container card fade-in">
                    <table className="policies-table">
                        <thead>
                            <tr>
                                <th>Policy Name</th>
                                <th>Company</th>
                                <th>Premium</th>
                                <th>Coverage</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {policies.map((policy) => (
                                <tr key={policy.id}>
                                    <td>{policy.policyName}</td>
                                    <td>{policy.companyName}</td>
                                    <td>${policy.premiumAmount.toLocaleString()}</td>
                                    <td>${policy.coverageAmount.toLocaleString()}</td>
                                    <td>{new Date(policy.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(policy.endDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge badge-${policy.status.toLowerCase()}`}>
                                            {policy.status}
                                        </span>
                                    </td>
                                    <td>
                                        {policy.status === 'ACTIVE' && (
                                            <button
                                                onClick={() => handleRenew(policy.id)}
                                                className="btn btn-sm btn-secondary"
                                            >
                                                Renew
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyPolicies;
