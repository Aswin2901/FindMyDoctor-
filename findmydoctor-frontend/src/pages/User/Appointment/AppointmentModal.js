import React, { useState } from 'react';
import axios from 'axios';
import './AppointmentModal.css';
import { useSelector } from 'react-redux';

const AppointmentModal = ({ doctorId, closeModal }) => {

    const userId = useSelector((state) => state.auth.user?.id);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(userId)
    try {
      await axios.post('http://localhost:8000/appointments/create/', {
        doctor: doctorId,
        patient: userId,  
        date,
        time,
        reason_for_visit: reason,
      });

      closeModal();
      alert('Appointment created successfully!');
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError('Failed to create appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-modal-overlay">
      <div className="appointment-modal">
        <h2>Book an Appointment</h2>
        <form onSubmit={handleSubmit}>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

          <label>Time:</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />

          <label>Reason for Visit:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe your reason for visit"
            required
          ></textarea>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
          <button type="button" onClick={closeModal} className="close-button">
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;