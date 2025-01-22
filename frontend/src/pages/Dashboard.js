import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
    const [materials, setMaterials] = useState([]);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const role = localStorage.getItem("role"); // Retrieve role from localStorage

    // Fetch materials for display
    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5000/api/materials"
                );
                setMaterials(res.data.materials);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch materials.");
                setLoading(false);
            }
        };

        fetchMaterials();
    }, []);

    // Handle file upload
    const handleFileUpload = async (e) => {
        e.preventDefault();

        if (!title || !file) {
            alert("Please provide a title and select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);

        try {
            await axios.post(
                "http://localhost:5000/api/materials/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setMaterials([
                ...materials,
                { title, url: `/uploads/${file.name}` },
            ]);
            alert("Material uploaded successfully!");
        } catch (err) {
            alert("Failed to upload material.");
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("role"); // Remove role from localStorage
        navigate("/login"); // Redirect to login page
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h2>Welcome, {role === "teacher" ? "Teacher" : "Student"}!</h2>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <section className="materials-section">
                <h3>Available Study Materials</h3>
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : (
                    <div className="materials-list">
                        {materials.map((material) => (
                            <div className="material-card" key={material._id}>
                                <a
                                    href={`http://localhost:5000${material.url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="material-link"
                                >
                                    {material.title}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Only show upload form for teachers */}
            {role === "teacher" && (
                <section className="upload-section">
                    <h3>Upload Study Material</h3>
                    <form onSubmit={handleFileUpload} className="upload-form">
                        <input
                            type="text"
                            placeholder="Material Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="input-field"
                        />
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                            className="file-input"
                        />
                        <button type="submit" className="submit-button">
                            Upload
                        </button>
                    </form>
                </section>
            )}
        </div>
    );
};

export default Dashboard;
