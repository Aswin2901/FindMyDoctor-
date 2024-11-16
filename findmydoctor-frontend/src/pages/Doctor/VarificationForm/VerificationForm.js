import React, { useState } from 'react';
import './VerificationForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import * as Yup from 'yup';
import { useAuth } from '../../../contexts/AuthContext';

const VerificationForm = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [profileData, setProfileData] = useState({
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

    const auth = useAuth()
    const doctorId = auth.auth.user.id

    const [documentData, setDocumentData] = useState({
        idProof: null,
        medicalLicense: null,
        degreeCertificate: null,
    });

    // Yup schemas
    const profileValidationSchema = Yup.object().shape({
        qualification: Yup.string().required('Qualification is required'),
        specialty: Yup.string().required('Specialty is required'),
        experience: Yup.number()
            .typeError('Experience must be a number')
            .required('Experience is required'),
        hospital: Yup.string().required('Hospital name is required'),
        clinic: Yup.string().required('Clinic address is required'),
        license: Yup.string().required('License number is required'),
        issuing_authority: Yup.string().required('Issuing authority is required'),
        expiry_date: Yup.date()
            .typeError('Invalid date')
            .required('License expiry date is required'),
        medical_registration: Yup.string().required('Medical council registration number is required'),
    });

    const documentValidationSchema = Yup.object().shape({
        idProof: Yup.mixed().required('ID Proof is required'),
        medicalLicense: Yup.mixed().required('Medical license is required'),
        degreeCertificate: Yup.mixed().required('Degree certificate is required'),
    });

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleFileChange = (e, fileKey) => {
        setDocumentData({ ...documentData, [fileKey]: e.target.files[0] });
    };

    const handleNext = async (e) => {
        e.preventDefault();
        try {
            await profileValidationSchema.validate(profileData, { abortEarly: false });
            setCurrentStep(2);
        } catch (err) {
            alert(err.errors.join('\n')); // Display validation errors
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await documentValidationSchema.validate(documentData, { abortEarly: false });

            const formData = new FormData();

            Object.entries(profileData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            Object.entries(documentData).forEach(([key, file]) => {
                formData.append(key, file);
            });

            const response = await axios.post(
                `http://localhost:8000/doctors/verify/${doctorId}/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Verification submitted:', response.data);
            navigate('/doctordashboard');
        } catch (err) {
            if (err.name === 'ValidationError') {
                alert(err.errors.join('\n')); // Display validation errors
            } else {
                console.error('Error submitting verification:', err);
            }
        }
    };

    return (
        <div>
            <Navbar />
            <br />
            <div className="verification-container">
                <h2 className="form-title">
                    {currentStep === 1 ? 'PROFILE' : 'DOCUMENT'}{' '}
                    <span className="highlight">VERIFICATION</span>
                </h2>

                {currentStep === 1 && (
                    <form className="profile-verification-form" onSubmit={handleNext}>
                        <label>
                            Qualification
                            <input
                                type="text"
                                name="qualification"
                                value={profileData.qualification}
                                onChange={handleProfileChange}
                                required
                            />
                        </label>
                        <label>
                            Specialty
                            <input
                                type="text"
                                name="specialty"
                                value={profileData.specialty}
                                onChange={handleProfileChange}
                                required
                            />
                        </label>
                        <label>
                            Years of Experience
                            <input
                                type="number"
                                name="experience"
                                value={profileData.experience}
                                onChange={handleProfileChange}
                                required
                            />
                        </label>
                        <label>
                            Hospital Name
                            <input
                                type="text"
                                name="hospital"
                                value={profileData.hospital}
                                onChange={handleProfileChange}
                                required
                            />
                        </label>
                        <label>
                            Clinic Address
                            <input
                                type="text"
                                name="clinic"
                                value={profileData.clinic}
                                onChange={handleProfileChange}
                                required
                            />
                        </label>
                        <label>
                            License Number
                            <input
                                type="text"
                                name="license"
                                value={profileData.license}
                                onChange={handleProfileChange}
                                required
                            />
                        </label>
                        <label>
                            License Issuing Authority
                            <input
                                type="text"
                                name="issuing_authority"
                                value={profileData.issuing_authority}
                                onChange={handleProfileChange}
                                required
                            />
                        </label>
                        <label>
                            License Expiry Date
                            <input
                                type="date"
                                name="expiry_date"
                                value={profileData.expiry_date}
                                onChange={handleProfileChange}
                                required
                            />
                        </label>
                        <label>
                            Medical Council Registration Number
                            <input
                                type="text"
                                name="medical_registration"
                                value={profileData.medical_registration}
                                onChange={handleProfileChange}
                                required
                            />
                        </label>

                        <button type="submit" className="submit-btn">
                            NEXT
                        </button>
                    </form>
                )}

                {currentStep === 2 && (
                    <form className="document-verification-form" onSubmit={handleSubmit}>
                        <div className="upload-field">
                            <label htmlFor="id-proof">ID PROOF</label>
                            <input
                                type="file"
                                id="id-proof"
                                onChange={(e) => handleFileChange(e, 'idProof')}
                                required
                            />
                            <p>Government-issued ID like Passport, Driving License, etc.</p>
                        </div>

                        <div className="upload-field">
                            <label htmlFor="medical-license">
                                MEDICAL LICENSE/CERTIFICATE UPLOAD
                            </label>
                            <input
                                type="file"
                                id="medical-license"
                                onChange={(e) => handleFileChange(e, 'medicalLicense')}
                                required
                            />
                            <p>Upload the official medical practice license.</p>
                        </div>

                        <div className="upload-field">
                            <label htmlFor="degree-certificate">DEGREE CERTIFICATES</label>
                            <input
                                type="file"
                                id="degree-certificate"
                                onChange={(e) => handleFileChange(e, 'degreeCertificate')}
                                required
                            />
                            <p>Upload degree certificates or other relevant qualifications.</p>
                        </div>

                        <button type="submit" className="submit-btn">
                            VERIFY
                        </button>
                    </form>
                )}
            </div>
            <br />
            <Footer />
        </div>
    );
};

export default VerificationForm;
