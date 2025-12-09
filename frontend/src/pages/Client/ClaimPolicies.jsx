import { useState, useEffect } from 'react';
import { clientPolicyService, claimService } from '../../services';
import './ClaimPolicies.css';

const ClaimPolicies = () => {
    const [policies, setPolicies] = useState([]);
    const [formData, setFormData] = useState({
        clientPolicyId: '',
        claimAmountRequested: '',
        description: '',
    });
    const [documents, setDocuments] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const data = await clientPolicyService.getMyPolicies();
                setPolicies(data.filter(p => p.status === 'ACTIVE'));
            } catch (err) {
                setError('Failed to load policies');
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    const handlePolicySelect = (e) => {
        const policyId = e.target.value;
        setFormData({ ...formData, clientPolicyId: policyId });
        const policy = policies.find(p => p.id === parseInt(policyId));
        setSelectedPolicy(policy);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setDocuments(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await claimService.createClaim({ ...formData, documents });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit claim');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    if (success) {
        return (
            <div className="success-container container">
                <div className="success-card card fade-in">
                    <div className="success-icon">✅</div>
                    <h1>Claim Submitted Successfully!</h1>
                    <p>Your claim has been submitted and is under review.</p>
                    <div className="success-actions">
                        <a href="/client" className="btn btn-primary">Go to Dashboard</a>
                        <a href="/client/my-policies" className="btn btn-secondary">View My Policies</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="claim-policies-container container">
            <h1 className="page-title fade-in">File Insurance Claim</h1>

            {policies.length === 0 ? (
                <div className="empty-state card">
                    <p>You don't have any active policies to claim against.</p>
                    <a href="/client/buy-policy" className="btn btn-primary">Buy a Policy</a>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="claim-form card fade-in">
                    {error && <div className="error-message">{error}</div>}

                    <div className="input-group">
                        <label className="input-label">Select Policy</label>
                        <select
                            name="clientPolicyId"
                            value={formData.clientPolicyId}
                            onChange={handlePolicySelect}
                            className="input-field"
                            required
                        >
                            <option value="">-- Select a Policy --</option>
                            {policies.map(policy => (
                                <option key={policy.id} value={policy.id}>
                                    {policy.policyName} - {policy.companyName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedPolicy && (
                        <div className="policy-info">
                            <p><strong>Max Coverage:</strong> ${selectedPolicy.coverageAmount.toLocaleString()}</p>
                        </div>
                    )}

                    <div className="input-group">
                        <label className="input-label">Claim Amount Requested</label>
                        <input
                            type="number"
                            name="claimAmountRequested"
                            value={formData.claimAmountRequested}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Enter amount"
                            min="0"
                            max={selectedPolicy?.coverageAmount}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Description of Incident</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field"
                            rows="5"
                            placeholder="Describe the incident and reason for claim..."
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Supporting Documents</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="input-field"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <small className="input-hint">Upload supporting documents (PDF, JPG, PNG)</small>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? 'Submitting Claim...' : 'Submit Claim'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ClaimPolicies;
