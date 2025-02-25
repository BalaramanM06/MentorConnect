import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", { email, password });
            const { role } = response.data; // Role: "mentor" or "mentee"

            if (role === "mentor") {
                navigate("/mentor-dashboard");
            } else {
                navigate("/mentee-dashboard");
            }
        } catch (error) {
            console.error("Login failed", error);
            alert("Invalid credentials");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleLogin} className="p-6 bg-gray-100 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <input className="w-full p-2 mb-2 border" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input className="w-full p-2 mb-4 border" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button className="w-full bg-blue-500 text-white py-2 rounded" type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
