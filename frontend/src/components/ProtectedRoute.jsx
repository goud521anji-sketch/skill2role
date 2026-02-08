import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import profileService from '../services/profileService';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const isProfileComplete = profileService.isProfileComplete();

    if (!token) {
        // Not logged in -> Redirect to Portal
        return <Navigate to="/auth/portal" state={{ from: location }} replace />;
    }

    if (!isProfileComplete) {
        // Logged in but profile incomplete -> Redirect to Onboarding
        return <Navigate to="/onboarding" replace />;
    }

    // Logged in and profile complete -> Allow access
    return children;
};

export default ProtectedRoute;
