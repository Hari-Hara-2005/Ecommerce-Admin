import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ element }) => {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("http://localhost:3000/verify-token", {
                    withCredentials: true,
                });
                setIsAuth(response.status === 200);
            } catch (error) {
                setIsAuth(false);
            }
        };
        checkAuth();
    }, []);

    if (isAuth === null) return <h1>Loading...</h1>;
    return isAuth ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
