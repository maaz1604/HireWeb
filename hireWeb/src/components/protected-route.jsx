import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isSignedIn, user, isLoaded } = useUser();
    const { pathname } = useLocation();

    if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
        return <Navigate to={`/?sign-in=true`} />
    }

    //check onboarding status
    return children;
}

export default ProtectedRoute