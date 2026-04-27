import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LiveSearch } from './LiveSearch';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
    const navigate = useNavigate();
    const { user, logout, isAdminOrMod } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/auth/login');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    return (
        <header className="bg-white border-b border-gray-100">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-14 items-center gap-6">
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                            <img src="/logo.png" alt="Logo" className="h-10 w-10" />
                            <span className="text-lg font-bold text-gray-900 hidden sm:block">Book Review</span>
                        </Link>
                        <div className="w-96 hidden md:block">
                            <LiveSearch />
                        </div>
                    </div>

                    <div className="flex items-center gap-5 flex-shrink-0">
                        <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Home</Link>
                        <Link to="/books" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Books</Link>
                        {isAdminOrMod && (
                            <Link to="/admin/complaints"
                                  className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
                                Mod Panel
                            </Link>
                        )}
                        {!user ? (
                            <div className="flex items-center gap-3">
                                <Link to="/auth/login"
                                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                    Log In
                                </Link>
                                <Link to="/auth/register"
                                      className="text-sm bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">{user.username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-gray-400 hover:text-red-500 transition-colors font-medium"
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};