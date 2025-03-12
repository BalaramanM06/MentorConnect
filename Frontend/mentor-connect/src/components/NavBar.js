import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-indigo-600">
                            Mentor Connect
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-indigo-600">
                            Home
                        </Link>
                        <Link to="/about" className="text-gray-700 hover:text-indigo-600">
                            About
                        </Link>
                        <Link to="/courses" className="text-gray-700 hover:text-indigo-600">
                            Courses
                        </Link>
                        <Link to="/contact" className="text-gray-700 hover:text-indigo-600">
                            Contact
                        </Link>
                    </div>

                    {/* Authentication Buttons */}
                    <div className="hidden md:flex space-x-4">
                        <Link to="/login" className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-100">
                            Login
                        </Link>
                        <Link to="/signup" className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                            Signup
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-md">
                    <Link to="/" className="block px-4 py-2 text-gray-700 hover:text-indigo-600">
                        Home
                    </Link>
                    <Link to="/about" className="block px-4 py-2 text-gray-700 hover:text-indigo-600">
                        About
                    </Link>
                    <Link to="/courses" className="block px-4 py-2 text-gray-700 hover:text-indigo-600">
                        Courses
                    </Link>
                    <Link to="/contact" className="block px-4 py-2 text-gray-700 hover:text-indigo-600">
                        Contact
                    </Link>
                    <Link to="/login" className="block px-4 py-2 text-indigo-600 border-t">
                        Login
                    </Link>
                    <Link to="/signup" className="block px-4 py-2 text-white bg-indigo-600 text-center">
                        Signup
                    </Link>
                </div>
            )}
        </nav>
    )
}

export default NavBar