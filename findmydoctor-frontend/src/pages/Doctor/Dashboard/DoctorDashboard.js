import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DoctorDashboard() {
    const [isVerified, setIsVerified] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const navigate = useNavigate();
    const doctorId = localStorage.getItem('doctor_id');

    useEffect(() => {
        async function checkVerification() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/doctors/verification/${doctorId}/`);
                setIsVerified(response.data.is_verified);
                setFormSubmitted(response.data.form_submitted);
            } catch (error) {
                console.error('Error checking verification:', error);
            }
        }
        checkVerification();
    }, [doctorId]);

    if (isVerified === null) {
        return <p>Loading...</p>;
    }

    if (!formSubmitted) {
        return (
            <div>
                <h2>Please complete your profile verification</h2>
                <button onClick={() => navigate('/profilevarification')}>Go to Verification</button>
            </div>
        );
    }

    if (!isVerified) {
        return (
            <div>
                <h2>Verification Pending</h2>
                <p>Your verification is under review. You will be notified once it is approved.</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Doctor Dashboard</h1>
            {/* Dashboard Content Here */}
        </div>
    );
}

export default DoctorDashboard;
