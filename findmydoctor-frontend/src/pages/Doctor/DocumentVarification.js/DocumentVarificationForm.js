import React, { useState } from 'react';
import './DocumentVarificationForm.css';

const DocumentVerificationForm = () => {
    const [idProof, setIdProof] = useState(null);
    const [medicalLicense, setMedicalLicense] = useState(null);
    const [degreeCertificate, setDegreeCertificate] = useState(null);

    const handleFileChange = (e, setFile) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic
        console.log('Submitting Documents:', { idProof, medicalLicense, degreeCertificate });
    };

    return (
        <div className="document-form-container">
            <h2 className="form-title">
                DOCUMENT <span className="highlight">VERIFICATION</span>
            </h2>
            <form className="document-verification-form" onSubmit={handleSubmit}>
                <div className="upload-field">
                    <label htmlFor="id-proof">ID PROOF</label>
                    <input type="file" id="id-proof" onChange={(e) => handleFileChange(e, setIdProof)} />
                    <p>Government-issued ID like Passport, Driving License, etc.</p>
                </div>

                <div className="upload-field">
                    <label htmlFor="medical-license">MEDICAL LICENSE/CERTIFICATE UPLOAD</label>
                    <input type="file" id="medical-license" onChange={(e) => handleFileChange(e, setMedicalLicense)} />
                    <p>Upload the official medical practice license.</p>
                </div>

                <div className="upload-field">
                    <label htmlFor="degree-certificate">DEGREE CERTIFICATES</label>
                    <input type="file" id="degree-certificate" onChange={(e) => handleFileChange(e, setDegreeCertificate)} />
                    <p>Upload degree certificates or other relevant qualifications.</p>
                </div>

                <button type="submit" className="submit-btn">VERIFY</button>
            </form>
        </div>
    );
};

export default DocumentVerificationForm;
