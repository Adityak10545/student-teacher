import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link component
import "./Signup.css";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student", // Default role is "student"
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "https://student-teacher-app.onrender.com/api/auth/signup",
                formData
            );

            console.log("Signup response:", response); // Log response data
            if (response.data.message) {
                alert("Signup successful. Please login.");
                navigate("/login");
            }
        } catch (err) {
            // Log the error response
            console.error("Error during signup:", err);
            setError(err.response?.data?.error || "An error occurred.");
        }
    };

    return (
        <div className="signup-container">
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
                {error && <p className="error">{error}</p>}
                <button type="submit">Signup</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>{" "}
            {/* Link to login page */}
        </div>
    );
};

export default Signup;
