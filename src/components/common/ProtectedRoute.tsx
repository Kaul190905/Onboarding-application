import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { Role } from '../../types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

