import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services';
import '../Client/BuyPolicy.css';

const CreatePolicy = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        premiumPerYear: '',
        coverageAmount: '',
        riskLevel: 'MEDIUM',
        minPeriodYears: '1',
        maxPeriodYears: '5',
    });
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setDocument(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await adminService.createPolicy({ ...formData, document });
            alert('Policy created successfully!');
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create policy');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="buy-policy-container container">
            <h1 className="page-title fade-in">Create New Policy</h1>

            <form onSubmit={handleSubmit} className="purchase-form card fade-in">
                {error && <div className="error-message">{error}</div>}

                <div className="input-group">
                    <label className="input-label">Policy Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Description / Terms and Conditions</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="input-field"
                        rows="5"
                        required
                    />
                </div>

                <div className="input-row">
                    <div className="input-group">
                        <label className="input-label">Premium Per Month (Rupees)</label>
                        <input
                            type="number"
                            name="premiumPerYear"
                            value={formData.premiumPerYear}
                            onChange={handleChange}
                            className="input-field"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Coverage Amount (Rupees)</label>
                        <input
                            type="number"
                            name="coverageAmount"
                            value={formData.coverageAmount}
                            onChange={handleChange}
                            className="input-field"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Risk Level</label>
                    <select
                        name="riskLevel"
                        value={formData.riskLevel}
                        onChange={handleChange}
                        className="input-field"
                        required
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>

                <div className="input-row">
                    <div className="input-group">
                        <label className="input-label">Min Period (Years)</label>
                        <input
                            type="number"
                            name="minPeriodYears"
                            value={formData.minPeriodYears}
                            onChange={handleChange}
                            className="input-field"
                            min="1"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Max Period (Years)</label>
                        <input
                            type="number"
                            name="maxPeriodYears"
                            value={formData.maxPeriodYears}
                            onChange={handleChange}
                            className="input-field"
                            min="1"
                            required
                        />
                    </div>
                </div>

                {/* <div className="input-group">
                    <label className="input-label">Policy Document (Optional)</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="input-field"
                        accept=".pdf"
                    />
                </div> */}

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin')} className="btn btn-outline">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Policy'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePolicy;
