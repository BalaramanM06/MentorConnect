import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("mentee"); // Default role
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/auth/signup", { name, email, password, role });
            alert("Signup successful! Please log in.");
            navigate("/");
        } catch (error) {
            console.error("Signup failed", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSignup} className="p-6 bg-gray-100 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Signup</h2>
                <input className="w-full p-2 mb-2 border" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input className="w-full p-2 mb-2 border" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input className="w-full p-2 mb-2 border" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <select className="w-full p-2 mb-4 border" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="mentee">Mentee</option>
                    <option value="mentor">Mentor</option>
                </select>
                <button className="w-full bg-green-500 text-white py-2 rounded" type="submit">Signup</button>
            </form>
        </div>
    );
}

export default SignUp