import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/complaintService';
import { reviewService } from '../services/reviewService';
import { bookService } from '../services/bookService';

export const AdminDashboard = () => {
    const { isAdminOrMod } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [pendingBooks, setPendingBooks] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAdminOrMod) return;
        const fetchAll = async () => {
            try {
                const [complaintsData, booksData] = await Promise.all([
                    complaintService.getComplaints(),
                    bookService.getPendingBooks()
                ]);
                setComplaints(complaintsData);
                setPendingBooks(booksData);
            } catch (err) {
                console.error('Failed to fetch data', err);
                setError('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [isAdminOrMod]);

    if (!isAdminOrMod) return <Navigate to="/" replace />;

    const handleDeleteReview = async (reviewId, complaintId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await reviewService.deleteReview(reviewId);
            setComplaints(prev => prev.filter(c => c.id !== complaintId));
        } catch (err) {
            alert('Failed to delete review.');
        }
    };

    const handleDismissComplaint = async (complaintId) => {
        try {
            await complaintService.dismissComplaint(complaintId);
            setComplaints(prev => prev.filter(c => c.id !== complaintId));
        } catch (err) {
            alert('Failed to dismiss complaint.');
        }
    };

    const handleBookStatus = async (bookId, status) => {
        try {
            await bookService.changeStatus(bookId, status);
            setPendingBooks(prev => prev.filter(b => b.id !== bookId));
        } catch (err) {
            alert('Failed to change status.');
        }
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-16 text-gray-400 text-center">Loading...</div>
    );
    if (error) return (
        <div className="max-w-7xl mx-auto px-4 py-8 text-red-500">{error}</div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Moderator Panel</h1>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'pending' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Pending Books
                    {pendingBooks.length > 0 && (
                        <span className="ml-1.5 bg-amber-100 text-amber-600 text-xs px-1.5 py-0.5 rounded-full">
                            {pendingBooks.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('complaints')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'complaints' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Complaints
                    {complaints.length > 0 && (
                        <span className="ml-1.5 bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">
                            {complaints.length}
                        </span>
                    )}
                </button>
            </div>

            {activeTab === 'pending' && (
                <div>
                    {pendingBooks.length === 0 ? (
                        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-gray-400 text-sm">
                            No pending books.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingBooks.map(book => (
                                <div key={book.id} className="bg-white border border-gray-100 rounded-xl p-5 flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/books/${book.id}`}
                                              className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                            {book.title}
                                        </Link>
                                        <p className="text-sm text-gray-400 mt-0.5">
                                            {book.authors?.map(a => a.fullName).join(', ')} · {book.genre}
                                        </p>
                                        {book.description && (
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{book.description}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button onClick={() => handleBookStatus(book.id, 'APPROVED')}
                                                className="text-sm px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium">
                                            Approve
                                        </button>
                                        <button onClick={() => handleBookStatus(book.id, 'REJECTED')}
                                                className="text-sm px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium">
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'complaints' && (
                <div>
                    {complaints.length === 0 ? (
                        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-gray-400 text-sm">
                            No complaints yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {complaints.map(complaint => (
                                <div key={complaint.id} className="bg-white border border-gray-100 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="inline-block text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                            {complaint.reason}
                                        </span>
                                        <p className="text-xs text-gray-400">
                                            {complaint.date} · review by <span className="text-gray-600">{complaint.reviewAuthor}</span>
                                            {complaint.complaintAuthor && (
                                                <> · complained by <span className="text-gray-600">{complaint.complaintAuthor}</span></>
                                            )}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-4">
                                        <p className="text-sm text-gray-700 italic line-clamp-3">"{complaint.reviewContent}"</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleDeleteReview(complaint.reviewId, complaint.id)}
                                                className="text-sm px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
                                            Delete Review
                                        </button>
                                        <button onClick={() => handleDismissComplaint(complaint.id)}
                                                className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};