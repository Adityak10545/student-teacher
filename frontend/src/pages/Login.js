import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password }
            );

            if (res.status === 200) {
                // Store the role in localStorage or state
                localStorage.setItem("role", res.data.role); // Assuming the API returns a role
                alert("Login successful!");
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="submit-button">
                        Login
                    </button>
                </form>
                {/* Link to the signup page */}
                <p>
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        className="signup-link"
                    >
                        Sign up here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
