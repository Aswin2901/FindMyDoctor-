import React from 'react';
import './ProfileVarificationForm.css';

const ProfileVerificationForm = () => {
    return (
        <div className="form-container">
            <h2 className="form-title">
                PROFILE <span className="highlight">VERIFICATION</span>
            </h2>
            <form className="verification-form">
                <input type="text" placeholder="Phone Number" name="phone" />
                <input type="date" placeholder="Date of Birth" name="dob" />
                <input type="text" placeholder="Gender" name="gender" />
                <input type="text" placeholder="Qualification" name="qualification" />
                <input type="text" placeholder="Specialty" name="specialty" />
                <input type="number" placeholder="Years of Experience" name="experience" />
                <input type="text" placeholder="Hospital Name" name="hospital" />
                <input type="text" placeholder="Clinic Address" name="clinic" />
                <input type="text" placeholder="License Number" name="license" />
                <input type="text" placeholder="License Issuing Authority" name="issuing_authority" />
                <input type="date" placeholder="License Expiry Date" name="expiry_date" />
                <input type="text" placeholder="Medical Council Registration Number" name="medical_registration" />
                <button type="submit" className="submit-btn">NEXT</button>
            </form>
            <p className="skip-verification">Skip for Now?</p>
        </div>
    );
};

export default ProfileVerificationForm;
