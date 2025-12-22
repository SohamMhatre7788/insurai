import { useState, useEffect } from 'react';
import { userService } from '../../services';
import '../Auth/Auth.css';

const Profile = () => {
      const user = JSON.parse(localStorage.getItem("user"));

    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [loading, setLoading] = useState(true);
    const [profileError, setProfileError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile(user.userId);
            setProfile({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
            });
        } catch (error) {
            setProfileError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
        setProfileError('');
        setProfileSuccess('');
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
        setPasswordError('');
        setPasswordSuccess('');
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await userService.updateProfile(user.userId, profile);

setProfileSuccess('Profile updated successfully!');

// 🔥 UPDATE localStorage user
const storedUser = JSON.parse(localStorage.getItem("user"));
localStorage.setItem(
    "user",
    JSON.stringify({
        ...storedUser,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
    })
);

// 🔄 Refresh navbar instantly
window.location.reload();

        } catch (error) {
            setProfileError(error.response?.data?.error || 'Failed to update profile');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        try {
            await userService.changePassword(user.userId, {
    currentPassword: passwordData.currentPassword,
    newPassword: passwordData.newPassword,
    confirmNewPassword: passwordData.confirmNewPassword,
});


            setPasswordSuccess('Password changed successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
        } catch (error) {
            setPasswordError(error.response?.data?.error || 'Failed to change password');
        }
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="auth-container">
            <div className="profile-container">
                {/* Profile Update Section */}
                <div className="auth-card card fade-in">
                    <h2>Update Profile</h2>
                    <form onSubmit={handleProfileSubmit} className="auth-form">
                        {profileError && <div className="error-message">{profileError}</div>}
                        {profileSuccess && <div className="success-message">{profileSuccess}</div>}

                        <div className="input-row">
                            <div className="input-group">
                                <label className="input-label">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={profile.firstName}
                                    onChange={handleProfileChange}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={profile.lastName}
                                    onChange={handleProfileChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Update Profile
                        </button>
                    </form>
                </div>

                {/* Password Change Section */}
                <div className="auth-card card fade-in">
                    <h2>Change Password</h2>
                    <form onSubmit={handlePasswordSubmit} className="auth-form">
                        {passwordError && <div className="error-message">{passwordError}</div>}
                        {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}

                        <div className="input-group">
                            <label className="input-label">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmNewPassword"
                                value={passwordData.confirmNewPassword}
                                onChange={handlePasswordChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
