import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { bookService } from '../services/bookService';
import { calculateRating } from '../utils/calculateRating';
import { ReviewForm } from '../components/ReviewForm';
import { ComplaintForm } from '../components/ComplaintForm';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';

export const BookDetailsPage = () => {
    const { id } = useParams();
    const { user, isAdminOrMod } = useAuth();
    const [book, setBook] = useState(null);
    const [bookReviews, setBookReviews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);
    const [coverUploading, setCoverUploading] = useState(false);
    const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const [data, reviews] = await Promise.all([
                    bookService.getBookById(id),
                    reviewService.getReviewsByBookId(id, 0, 10)
                ]);
                setBook(data);
                setBookReviews(reviews);
            } catch {
                setError('Failed to fetch book details');
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleReviewAdded = (newReview) => {
        setBookReviews(r => ({ ...r, content: [...r.content, newReview] }));
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Delete this review?')) return;
        try {
            await reviewService.deleteReview(reviewId);
            setBookReviews(r => ({ ...r, content: r.content.filter(rev => rev.id !== reviewId) }));
        } catch {
            alert('Failed to delete review.');
        }
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Show local preview immediately — no waiting for the server
        const localUrl = URL.createObjectURL(file);
        setCoverPreviewUrl(localUrl);
        setCoverUploading(true);
        try {
            // Build relative coverUrl from the absolute coverPath the server returns,
            // matching what BookMapper would produce — avoids a second getBookById call
            const { coverPath } = await bookService.uploadCover(id, file);
            const filename = coverPath.split('/').pop().split('\\').pop();
            const coverUrl = `/books/covers/${filename}`;
            setBook(prev => ({ ...prev, coverUrl }));
            setCoverPreviewUrl(null);
        } catch (err) {
            setCoverPreviewUrl(null); // revert preview on error
            alert(err.response?.data?.message || 'Failed to upload cover');
        } finally {
            setCoverUploading(false);
        }
    };

    if (loading) return <div className="max-w-7xl mx-auto px-4 py-16 text-gray-400 text-center">Loading...</div>;
    if (error) return <div className="max-w-7xl mx-auto px-4 py-8 text-red-500">{error}</div>;
    if (!book) return <div className="max-w-7xl mx-auto px-4 py-8 text-gray-500">Book not found</div>;

    const coverUrl = coverPreviewUrl || bookService.getCoverUrl(book.coverUrl);
    const rating = calculateRating(book.reviews);
    const colors = ['bg-blue-100','bg-green-100','bg-pink-100','bg-purple-100','bg-amber-100','bg-teal-100'];
    const coverColor = colors[book.id % colors.length];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Book header */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
                <div className="flex gap-6">
                    <div className="flex-shrink-0">
                        <div className={`w-32 h-44 rounded-xl overflow-hidden ${coverColor} flex items-end`}>
                            {coverUrl
                                ? <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" />
                                : <span className="text-xs p-2 opacity-60 font-medium leading-tight">{book.title}</span>
                            }
                        </div>
                        {isAdminOrMod && (
                            <div className="mt-2">
                                <input type="file" ref={fileInputRef} onChange={handleCoverUpload}
                                       accept="image/*" className="hidden" />
                                <button onClick={() => fileInputRef.current.click()} disabled={coverUploading}
                                        className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
                                    {coverUploading ? 'Uploading...' : 'Upload Cover'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
                            {book.status && book.status !== 'APPROVED' && (
                                <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                                    book.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                                }`}>{book.status}</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                            {book.authors?.map(a => a.fullName).join(', ') || 'Unknown author'}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{book.genre}</span>
                            {book.publicationDate && (
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{book.publicationDate}</span>
                            )}
                            {book.reviews?.length > 0 && (
                                <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full font-medium">
                                    ★ {rating.toFixed(1)} ({book.reviews.length} reviews)
                                </span>
                            )}
                        </div>
                        {book.description && (
                            <p className="text-sm text-gray-600 leading-relaxed">{book.description}</p>
                        )}
                        {isAdminOrMod && book.status === 'PENDING' && (
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => bookService.changeStatus(id, 'APPROVED').then(() => alert('Approved'))}
                                        className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium transition-colors">
                                    Approve
                                </button>
                                <button onClick={() => bookService.changeStatus(id, 'REJECTED').then(() => alert('Rejected'))}
                                        className="text-xs px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium transition-colors">
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                    Reviews
                    {bookReviews?.content?.length > 0 && (
                        <span className="ml-2 text-sm font-normal text-gray-400">({bookReviews.content.length})</span>
                    )}
                </h2>
                {bookReviews?.content?.length === 0 && (
                    <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-sm text-gray-400">
                        No reviews yet. Be the first!
                    </div>
                )}
                <div className="space-y-3">
                    {bookReviews?.content?.map(review => (
                        <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-4">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                                        {review.username?.slice(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{review.username}</span>
                                    <span className="text-xs text-amber-500 font-medium">★ {review.rating}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400">{review.date}</span>
                                    {user && review.username !== user?.username && (
                                        <button onClick={() => setSelectedReview(review.id)}
                                                className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
                                            Report
                                        </button>
                                    )}
                                    {isAdminOrMod && review.username !== user?.username && (
                                        <button onClick={() => handleDeleteReview(review.id)}
                                                className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed break-words whitespace-pre-line">
                                {review.comment}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add review — only for logged in users */}
            {user ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4">Write a Review</h2>
                    <ReviewForm bookId={book.id} onReviewAdded={handleReviewAdded} />
                </div>
            ) : (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 text-center">
                    <p className="text-sm text-gray-400">
                        <a href="/auth/login" className="text-blue-500 hover:text-blue-600 font-medium">Log in</a>
                        {' '}to leave a review
                    </p>
                </div>
            )}

            {selectedReview && (
                <ComplaintForm reviewId={selectedReview}
                               onClose={() => setSelectedReview(null)}
                               onComplaintSubmitted={() => setSelectedReview(null)} />
            )}
        </div>
    );
};