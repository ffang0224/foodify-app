import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../hooks/useAuthUser';
import { auth } from '../firebase';
import { updatePassword, deleteUser, signOut, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { userData, loading, updateUserData } = useAuthUser();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Only include fields that have been changed
      const updateData = {};
      
      if (formData.firstName !== userData?.firstName) {
        updateData.firstName = formData.firstName;
      }
      if (formData.lastName !== userData?.lastName) {
        updateData.lastName = formData.lastName;
      }
      if (formData.email !== userData?.email) {
        updateData.email = formData.email;
      }
      if (formData.username !== userData?.username) {
        updateData.username = formData.username;
      }

      // Only make the API call if there are changes
      if (Object.keys(updateData).length > 0) {
        await updateUserData(updateData);
        setSuccess('Profile updated successfully');
        setIsEditing(false);
      } else {
        setError('No changes made to update');
      }
    } catch (err) {
      setError(err.message || 'Error updating profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const user = auth.currentUser;
      
      // First, re-authenticate the user
      const credential = EmailAuthProvider.credential(
        user.email,
        formData.currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      
      // Then update the password
      await updatePassword(user, formData.newPassword);
      
      setSuccess('Password updated successfully');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('Error changing password:', err);
      if (err.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else if (err.code === 'auth/requires-recent-login') {
        setError('Please log in again to change your password');
      } else if (err.code === 'auth/weak-password') {
        setError('New password is too weak. It should be at least 6 characters');
      } else {
        setError(err.message);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      await deleteUser(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded">
            {success}
          </div>
        )}

        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Profile Information</h2>
            <form onSubmit={handleEditProfile}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder={userData?.firstName}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder={userData?.lastName}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder={userData?.email}
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder={userData?.username}
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-end">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="text-gray-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Account Actions</h2>
            <div className="space-y-4">
              <button
                onClick={handleSignOut}
                className="w-full p-2 text-left text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                Sign Out
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="w-full p-2 text-left text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-bold mb-2">Are you sure?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;