import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CreateFamilyForm from './components/CreateFamilyForm';
import LoginForm from './components/LoginForm';
import VerifyToken from './components/VerifyToken';
import MagicLinkVerification from './components/MagicLinkVerification';
import AcceptInvite from './components/AcceptInvite';
import CreatePostForm from './components/CreatePostForm';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';
import './App.css';
import './components/Banner.css';
import './components/Navigation.css';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create-family" element={<CreateFamilyForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/verify-token" element={<VerifyToken />} />
            <Route path="/auth/verify/:token" element={<MagicLinkVerification />} />
            <Route path="/accept-invite/:code" element={<AcceptInvite />} />
            <Route path="/create-post" element={<PrivateRoute><CreatePostForm /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          </Routes>
        </MainLayout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
