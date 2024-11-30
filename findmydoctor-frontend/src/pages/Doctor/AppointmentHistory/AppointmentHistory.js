import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AppointmentHistory.css';

function AppointmentHistory({ doctorId }) {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAppointments() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/appointments/history/${doctorId}/`);
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointment history:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAppointments();
    }, [doctorId]);

    const handleCancelAppointment = async (appointmentId) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await axios.post(`http://127.0.0.1:8000/appointments/cancel/${appointmentId}/`);
                setAppointments((prevAppointments) =>
                    prevAppointments.filter((appointment) => appointment.id !== appointmentId)
                );
                alert('Appointment canceled successfully.');
            } catch (error) {
                console.error('Error canceling appointment:', error);
                alert('Failed to cancel the appointment.');
            }
        }
    };

    if (loading) {
        return <p>Loading appointment history...</p>;
    }

    return (
        <div className="appointment-history">
            <h2>Appointment History</h2>
            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                <ul className="appointment-list">
                    {appointments.map((appointment) => (
                        <li key={appointment.id} className="appointment-item">
                            <div className="appointment-row">
                                <p><strong>Patient:</strong> {appointment.patient_name}</p>
                                <p><strong>Date:</strong> {appointment.date}</p>
                            </div>
                            <div className="appointment-row">
                                <p><strong>Time:</strong> {appointment.time}</p>
                                <p><strong>Status:</strong> {appointment.status}</p>
                            </div>
                            <div className="button-row">
                                {appointment.status !== 'canceled' && (
                                    <button
                                        className="cancel-button"
                                        onClick={() => handleCancelAppointment(appointment.id)}
                                    >
                                        Cancel Appointment
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AppointmentHistory;
