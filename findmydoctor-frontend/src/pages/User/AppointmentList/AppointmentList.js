import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AppointmentList.css";
import { useAuth } from "../../../contexts/AuthContext";
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Navbar/Navbar";

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = useAuth();
    const userId = auth.auth.user.id;

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/appointments/get_appointments/${userId}/`)
            .then(response => {
                setAppointments(response.data.appointments);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching appointments:", error));
    }, [userId]);

    const cancelAppointment = (id) => {
        axios.post(`http://127.0.0.1:8000/appointments/${id}/user_cancel/${userId}`)
            .then(() => {
                alert("Appointment canceled successfully!");
                setAppointments(prev => prev.filter(app => app.id !== id));
            })
            .catch(error => console.error("Error canceling appointment:", error));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="appointment-list">
                <h2>Appointments</h2>
                {appointments.length > 0 ? (
                    <table className="appointment-table">
                        <thead>
                            <tr>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(app => (
                                <tr key={app.id}>
                                    <td>{app.doctor_name}</td>
                                    <td>{app.date}</td>
                                    <td>{app.time}</td>
                                    <td>{app.reason_for_visit}</td>
                                    <td>{app.status}</td>
                                    <td>{app.status === "Confirmed" ? (
                                            <button 
                                                onClick={() => cancelAppointment(app.id)} 
                                                className="cancel-button"
                                            >
                                                Cancel
                                            </button>
                                        ) : (
                                            <span>{app.status}</span>
                                        )}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No appointments found.</p>
                )}
            </div>
            <Footer />
        </>
    );
};

export default AppointmentList;
