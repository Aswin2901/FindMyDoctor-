import React, { useState } from 'react';
import axios from 'axios';
import './AppointmentModal.css';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../../contexts/AuthContext';

const AppointmentModal = ({ doctorId, closeModal }) => {
  const auth = useAuth()
  const userId = auth.auth.user.id
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    date: Yup.date().required('Date is required'),
    time: Yup.string().required('Time is required'),
    reason: Yup.string()
      .min(10, 'Reason must be at least 10 characters')
      .required('Reason for visit is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setServerError(null);

    try {
      await axios.post('http://localhost:8000/appointments/create/', {
        doctor: doctorId,
        patient: userId,
        date: values.date,
        time: values.time,
        reason_for_visit: values.reason,
      });

      resetForm();
      closeModal();
      alert('Appointment created successfully!');
    } catch (err) {
      console.error('Error creating appointment:', err);
      setServerError(
        err.response?.data?.message || 'Failed to create appointment. Please try again.'
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div
      className="appointment-modal-overlay"
      role="dialog"
      aria-labelledby="appointment-modal-title"
      aria-describedby="appointment-modal-description"
    >
      <div className="appointment-modal">
        <h2 id="appointment-modal-title">Book an Appointment</h2>

        <Formik
          initialValues={{ date: '', time: '', reason: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <label htmlFor="date">Date:</label>
              <Field type="date" name="date" id="date" />
              <ErrorMessage name="date" component="div" className="error" />

              <label htmlFor="time">Time:</label>
              <Field type="time" name="time" id="time" />
              <ErrorMessage name="time" component="div" className="error" />

              <label htmlFor="reason">Reason for Visit:</label>
              <Field
                as="textarea"
                name="reason"
                id="reason"
                placeholder="Describe your reason for visit"
              />
              <ErrorMessage name="reason" component="div" className="error" />

              {serverError && <p className="error">{serverError}</p>}

              <button type="submit" disabled={isSubmitting || loading}>
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="close-button"
                disabled={loading}
              >
                Close
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AppointmentModal;
