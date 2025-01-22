import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const App = () => {
    const isAuthenticated = localStorage.getItem("user");

    return (
        <Router>
            <Routes>
                {/* Redirect root to signup */}
                <Route path="/" element={<Navigate to="/signup" replace />} />

                {/* Signup route */}
                <Route path="/signup" element={<Signup />} />

                {/* Login route */}
                <Route path="/login" element={<Login />} />

                {/* Dashboard route */}
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
