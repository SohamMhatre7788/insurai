import { useState, useEffect } from 'react';
import { adminService } from '../../services';
import './ManageClaims.css';

const ManageClaims = () => {
    const [claims, setClaims] = useState([]);
    const [filter, setFilter] = useState('PENDING');
    const [loading, setLoading] = useState(true);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [modalData, setModalData] = useState({ approvedAmount: '', rejectionReason: '' });

    useEffect(() => {
        fetchClaims();
    }, [filter]);

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllClaims(filter || null);
            setClaims(data);
        } catch (error) {
            console.error('Error fetching claims:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveClaim = async () => {
        try {
            await adminService.approveClaim(selectedClaim.id, parseFloat(modalData.approvedAmount));
            alert('Claim approved successfully!');
            setSelectedClaim(null);
            setModalData({ approvedAmount: '', rejectionReason: '' });
            fetchClaims();
        } catch (error) {
            alert('Failed to approve claim');
        }
    };

    const handleRejectClaim = async () => {
        try {
            await adminService.rejectClaim(selectedClaim.id, modalData.rejectionReason);
            alert('Claim rejected successfully!');
            setSelectedClaim(null);
            setModalData({ approvedAmount: '', rejectionReason: '' });
            fetchClaims();
        } catch (error) {
            alert('Failed to reject claim');
        }
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="manage-claims-container container">
            <h1 className="page-title fade-in">Manage Claims</h1>

            <div className="filter-buttons fade-in">
                <button
                    onClick={() => setFilter('PENDING')}
                    className={`btn ${filter === 'PENDING' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setFilter('APPROVED')}
                    className={`btn ${filter === 'APPROVED' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Approved
                </button>
                <button
                    onClick={() => setFilter('REJECTED')}
                    className={`btn ${filter === 'REJECTED' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Rejected
                </button>
                <button
                    onClick={() => setFilter(null)}
                    className={`btn ${filter === null ? 'btn-primary' : 'btn-outline'}`}
                >
                    All
                </button>
            </div>

            <div className="claims-table-container card fade-in">
                <table className="policies-table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Policy</th>
                            <th>Claim Amount</th>
                            <th>Max Coverage</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claims.map((claim) => (
                            <tr key={claim.id}>
                                <td>{claim.companyName}</td>
                                <td>{claim.policyName}</td>
                                <td>${claim.claimAmountRequested.toLocaleString()}</td>
                                <td>${claim.maxCoverageForPolicy.toLocaleString()}</td>
                                <td>
                                    <span className={`badge badge-${claim.status.toLowerCase()}`}>
                                        {claim.status}
                                    </span>
                                </td>
                                <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        onClick={() => setSelectedClaim(claim)}
                                        className="btn btn-sm btn-primary"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Claim Detail Modal */}
            {selectedClaim && (
                <div className="modal-overlay" onClick={() => setSelectedClaim(null)}>
                    <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
                        <h2>Claim Details</h2>
                        <div className="claim-details">
                            <p><strong>Company:</strong> {selectedClaim.companyName}</p>
                            <p><strong>Policy:</strong> {selectedClaim.policyName}</p>
                            <p><strong>Claim Amount:</strong> ${selectedClaim.claimAmountRequested.toLocaleString()}</p>
                            <p><strong>Max Coverage:</strong> ${selectedClaim.maxCoverageForPolicy.toLocaleString()}</p>
                            <p><strong>Description:</strong> {selectedClaim.description}</p>
                            <p><strong>Status:</strong> {selectedClaim.status}</p>
                            {selectedClaim.supportingDocumentUrls?.length > 0 && (
                                <div>
                                    <strong>Documents:</strong>
                                    <ul>
                                        {selectedClaim.supportingDocumentUrls.map((url, index) => (
                                            <li key={index}>
                                                <a href={url} target="_blank" rel="noopener noreferrer">Document {index + 1}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {selectedClaim.status === 'PENDING' && (
                            <div className="modal-actions">
                                <div className="input-group">
                                    <label className="input-label">Approved Amount</label>
                                    <input
                                        type="number"
                                        value={modalData.approvedAmount}
                                        onChange={(e) => setModalData({ ...modalData, approvedAmount: e.target.value })}
                                        className="input-field"
                                        placeholder="Enter approved amount"
                                    />
                                </div>
                                <button onClick={handleApproveClaim} className="btn btn-success">
                                    Approve Claim
                                </button>

                                <div className="input-group">
                                    <label className="input-label">Rejection Reason</label>
                                    <textarea
                                        value={modalData.rejectionReason}
                                        onChange={(e) => setModalData({ ...modalData, rejectionReason: e.target.value })}
                                        className="input-field"
                                        placeholder="Enter rejection reason"
                                        rows="3"
                                    />
                                </div>
                                <button onClick={handleRejectClaim} className="btn btn-danger">
                                    Reject Claim
                                </button>
                            </div>
                        )}

                        <button onClick={() => setSelectedClaim(null)} className="btn btn-outline">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageClaims;
