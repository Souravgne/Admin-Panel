import React, { useState } from 'react';
import { useFirebase } from '../context/Firebase';
import './Edit.css';

function EditUserModal({ user, onClose }) {
  const [formData, setFormData] = useState(user);
  const { updateDocument } = useFirebase();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDocument('users', user.uid, formData);
      onClose();
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit User Details</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>
          <label>
            Phone:
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </label>
          <label>
            Referral Code:
            <input type="text" name="referralcode" value={formData.referralcode} onChange={handleChange} />
          </label>
          <label>
            Aadhar No.:
            <input type="text" name="aadharno" value={formData.aadharno} onChange={handleChange} />
          </label>
          <label>
            Pan No.:
            <input type="text" name="panno" value={formData.panno} onChange={handleChange} />
          </label>
          <label>
            Wallet Balance:
            <input type="text" name="walletbalance" value={formData.walletbalance} onChange={handleChange} />
          </label>
          <button type="submit">Save</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default EditUserModal;
