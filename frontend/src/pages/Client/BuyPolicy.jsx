import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { policyService, clientPolicyService } from '../../services';
import './BuyPolicy.css';

const BuyPolicy = () => {
    const [policies, setPolicies] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [formData, setFormData] = useState({
        policyId: '',
        companyName: '',
        numberOfEmployees: '',
        policyPeriodYears: '',
    });
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const data = await policyService.getAllPolicies();
                setPolicies(data);
            } catch (error) {
                setError('Failed to load policies');
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    const handleSelectPolicy = (policy) => {
        setSelectedPolicy(policy);
        setFormData({ ...formData, policyId: policy.id, policyPeriodYears: policy.minPeriodYears });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculatePremium = () => {
        if (!selectedPolicy || !formData.policyPeriodYears) return 0;
        return selectedPolicy.premiumPerYear * formData.numberOfEmployees;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPurchasing(true);
        setError('');

        try {
            await clientPolicyService.buyPolicy(formData);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to purchase policy');
        } finally {
            setPurchasing(false);
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
                    <h1>Thank You for Purchasing Our Policy!</h1>
                    <p>Your policy has been successfully activated.</p>
                    <div className="success-actions">
                        <button onClick={() => navigate('/client')} className="btn btn-primary">
                            Go to Dashboard
                        </button>
                        <button onClick={() => navigate('/client/my-policies')} className="btn btn-secondary">
                            View My Policies
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="buy-policy-container container">
            <h1 className="page-title fade-in">Buy Insurance Policy</h1>

            {!selectedPolicy ? (
                <div className="policies-grid fade-in">
                    {policies.map((policy) => (
                        <div key={policy.id} className="policy-card card card-hover">
                            <div className="policy-header">
                                <h3>{policy.name}</h3>
                                <span className={`badge badge-${policy.riskLevel.toLowerCase()}`}>
                                    {policy.riskLevel}
                                </span>
                            </div>
                            <p className="policy-description">{policy.description}</p>
                            <div className="policy-details">
                                <div className="detail-item">
                                    <span className="detail-label">Coverage:</span>
                                    <span className="detail-value">{policy.coverageAmount.toLocaleString()} Rupees</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Premium/Year:</span>
                                    <span className="detail-value">{policy.premiumPerYear.toLocaleString()} Rupees</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Period:</span>
                                    <span className="detail-value">{policy.minPeriodYears}-{policy.maxPeriodYears} years</span>
                                </div>
                            </div>
                            <button onClick={() => handleSelectPolicy(policy)} className="btn btn-primary">
                                Select Policy
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="purchase-form-container fade-in">
                    <div className="selected-policy-summary card">
                        <h3>Selected Policy: {selectedPolicy.name}</h3>
                        <p>Individual Coverage: {selectedPolicy.coverageAmount.toLocaleString()} Rupees</p>
                    </div>

                    <form onSubmit={handleSubmit} className="purchase-form card">
                        {error && <div className="error-message">{error}</div>}

                        <div className="input-group">
                            <label className="input-label">Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Number of Employees</label>
                            <input
                                type="number"
                                name="numberOfEmployees"
                                value={formData.numberOfEmployees}
                                onChange={handleChange}
                                className="input-field"
                                min="1"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Policy Period (Years)</label>
                            <input
                                type="number"
                                name="policyPeriodYears"
                                value={formData.policyPeriodYears}
                                onChange={handleChange}
                                className="input-field"
                                min={selectedPolicy.minPeriodYears}
                                max={selectedPolicy.maxPeriodYears}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="input-label">Terms & condition:<br/></label>
                            <div>{policies.map((policy) => (
                                <p className="policy-description">{policy.description}</p>
                            ))}
                            </div>
                        </div>
                        <div className="premium-summary">
                            <h4>Total Premium(Per Month): {calculatePremium().toLocaleString()} Rupees</h4>
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={() => setSelectedPolicy(null)} className="btn btn-outline">
                                Back to Policies
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={purchasing}>
                                {purchasing ? 'Processing...' : 'Purchase Policy'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BuyPolicy;
