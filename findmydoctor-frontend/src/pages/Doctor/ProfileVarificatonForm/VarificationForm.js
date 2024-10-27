import React, { useState } from 'react';
import './VerificationForm.css';
import axios from 'axios';

const VerificationForm = () => {
    const [currentStep, setCurrentStep] = useState(1); // Track which step the user is on
    const [profileData, setProfileData] = useState({
        phone: '',
        dob: '',
        gender: '',
        qualification: '',
        specialty: '',
        experience: '',
        hospital: '',
        clinic: '',
        license: '',
        issuing_authority: '',
        expiry_date: '',
        medical_registration: '',
    });

    const [documentData, setDocumentData] = useState({
        idProof: null,
        medicalLicense: null,
        degreeCertificate: null,
    });

    // Handle profile form input changes
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    // Handle document file input changes
    const handleFileChange = (e, fileKey) => {
        setDocumentData({ ...documentData, [fileKey]: e.target.files[0] });
    };

    // Move to next step
    const handleNext = (e) => {
        e.preventDefault();
        setCurrentStep(2);
    };

    // Submit all data to backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Append profile data
        Object.entries(profileData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Append document files
        Object.entries(documentData).forEach(([key, file]) => {
            formData.append(key, file);
        });

        try {
            const response = await axios.post('http://localhost:8000/api/doctor/verify', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Verification submitted:', response.data);
        } catch (error) {
            console.error('Error submitting verification:', error);
        }
    };

    return (
        <div className="verification-container">
            <h2 className="form-title">
                {currentStep === 1 ? 'PROFILE' : 'DOCUMENT'} <span className="highlight">VERIFICATION</span>
            </h2>
            
            {currentStep === 1 && (
                <form className="profile-verification-form" onSubmit={handleNext}>
                    <input type="text" placeholder="Phone Number" name="phone" value={profileData.phone} onChange={handleProfileChange} />
                    <input type="date" placeholder="Date of Birth" name="dob" value={profileData.dob} onChange={handleProfileChange} />
                    <input type="text" placeholder="Gender" name="gender" value={profileData.gender} onChange={handleProfileChange} />
                    <input type="text" placeholder="Qualification" name="qualification" value={profileData.qualification} onChange={handleProfileChange} />
                    <input type="text" placeholder="Specialty" name="specialty" value={profileData.specialty} onChange={handleProfileChange} />
                    <input type="number" placeholder="Years of Experience" name="experience" value={profileData.experience} onChange={handleProfileChange} />
                    <input type="text" placeholder="Hospital Name" name="hospital" value={profileData.hospital} onChange={handleProfileChange} />
                    <input type="text" placeholder="Clinic Address" name="clinic" value={profileData.clinic} onChange={handleProfileChange} />
                    <input type="text" placeholder="License Number" name="license" value={profileData.license} onChange={handleProfileChange} />
                    <input type="text" placeholder="License Issuing Authority" name="issuing_authority" value={profileData.issuing_authority} onChange={handleProfileChange} />
                    <input type="date" placeholder="License Expiry Date" name="expiry_date" value={profileData.expiry_date} onChange={handleProfileChange} />
                    <input type="text" placeholder="Medical Council Registration Number" name="medical_registration" value={profileData.medical_registration} onChange={handleProfileChange} />
                    
                    <button type="submit" className="submit-btn">NEXT</button>
                </form>
            )}

            {currentStep === 2 && (
                <form className="document-verification-form" onSubmit={handleSubmit}>
                    <div className="upload-field">
                        <label htmlFor="id-proof">ID PROOF</label>
                        <input type="file" id="id-proof" onChange={(e) => handleFileChange(e, 'idProof')} />
                        <p>Government-issued ID like Passport, Driving License, etc.</p>
                    </div>

                    <div className="upload-field">
                        <label htmlFor="medical-license">MEDICAL LICENSE/CERTIFICATE UPLOAD</label>
                        <input type="file" id="medical-license" onChange={(e) => handleFileChange(e, 'medicalLicense')} />
                        <p>Upload the official medical practice license.</p>
                    </div>

                    <div className="upload-field">
                        <label htmlFor="degree-certificate">DEGREE CERTIFICATES</label>
                        <input type="file" id="degree-certificate" onChange={(e) => handleFileChange(e, 'degreeCertificate')} />
                        <p>Upload degree certificates or other relevant qualifications.</p>
                    </div>

                    <button type="submit" className="submit-btn">VERIFY</button>
                </form>
            )}
        </div>
    );
};

export default VerificationForm;
