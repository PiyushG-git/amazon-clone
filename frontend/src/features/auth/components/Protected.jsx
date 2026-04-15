import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAppStore from '../../../app/app.store';

const Protected = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const { authLoading } = useAppStore();

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <style>{`
                    .spinner {
                        width: 40px;
                        height: 40px;
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #febd69;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default Protected;
