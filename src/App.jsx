import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Header} from './components/Header';
import {HomePage} from './pages/HomePage';
import {BookDetailsPage} from './pages/BookDetailsPage';
import {BooksPage} from "./pages/BooksPage";
import {AddBookPage} from './pages/AddBookPage';
import {AdminDashboard} from './pages/AdminDashboard';
import {LoginPage} from './pages/auth/LoginPage';
import {RegisterPage} from './pages/auth/RegisterPage';
import {AuthProvider} from "./context/AuthContext";

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-100">
                    <Header/>
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/books" element={<BooksPage/>}/>
                            <Route path="/books/:id" element={<BookDetailsPage/>}/>
                            <Route path="/books/add" element={<AddBookPage/>}/>
                            <Route path="/admin/complaints" element={<AdminDashboard/>}/>
                            <Route path="/auth/login" element={<LoginPage/>}/>
                            <Route path="/auth/register" element={<RegisterPage/>}/>
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;