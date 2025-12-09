import { useState, useEffect } from 'react';
import { adminService } from '../../services';
import '../Client/MyPolicies.css';

const ManageClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const data = await adminService.getAllClients();
            setClients(data);
        } catch (err) {
            setError('Failed to load clients');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (clientId) => {
        if (!window.confirm('Are you sure you want to delete this client?')) {
            return;
        }

        try {
            await adminService.deleteClient(clientId);
            fetchClients();
            alert('Client deleted successfully!');
        } catch (err) {
            alert('Failed to delete client');
        }
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="my-policies-container container">
            <h1 className="page-title fade-in">Manage Clients</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="policies-table-container card fade-in">
                <table className="policies-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>{client.firstName} {client.lastName}</td>
                                <td>{client.email}</td>
                                <td>{client.role}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(client.id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageClients;
