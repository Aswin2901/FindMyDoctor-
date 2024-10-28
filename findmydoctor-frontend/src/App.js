import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/User/SignupPage/Signup';
import Login from './pages/User/LoginPage/Login';
import Home from './pages/User/HomePage/Home';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import '@fortawesome/fontawesome-free/css/all.min.css';
import VerificationForm from './pages/Doctor/VarificationForm/VerificationForm';
import DoctorSignup from './pages/Doctor/Signup/DoctorSignup';
import DoctorLogin from './pages/Doctor/LoginPage/DoctorLogin';
import DoctorDashboard from './pages/Doctor/Dashboard/DoctorDashboard';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import GoogleCallback from './components/GoogleCallback/GoogleCallback';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/doctorsignup" element={<DoctorSignup />} />
          <Route path="/doctorlogin" element={<DoctorLogin />} />
          <Route path="/doctordashboard" element={<DoctorDashboard />} />
          <Route path="/profilevarification" element={<VerificationForm />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/oauth/callback" element={<GoogleCallback />} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
