import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import Verify from './pages/Verify';
import CreateFamily from './pages/CreateFamily';
import ManualVerify from './pages/ManualVerify';
import Invite from './pages/Invite';
import Onboarding from './pages/Onboarding';
import AcceptInvite from './pages/AcceptInvite';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import './index.css';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/manual-verify" element={<ManualVerify />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/auth/verify/:token" element={<Verify />} />
        <Route path="/create-family" element={<ProtectedRoute><CreateFamily /></ProtectedRoute>} />
        <Route path="/invite" element={<ProtectedRoute><Invite /></ProtectedRoute>} />
        <Route path="/join/:code" element={<AcceptInvite />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </Router>
  );
}

export default App;

