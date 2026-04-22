import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {bookService} from '../services/bookService';
import {reviewService} from '../services/reviewService';

const StarRating = ({rating}) => (
    <span className="text-amber-500 font-medium text-sm">★ {Number(rating).toFixed(1)}</span>
);

const BookCover = ({book, className = ''}) => {
    const coverUrl = bookService.getCoverUrl(book.coverUrl);
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-purple-100', 'bg-amber-100', 'bg-teal-100'];
    const color = colors[book.id % colors.length];
    return (
        <div className={`rounded-md overflow-hidden flex items-end ${color} ${className}`}>
            {coverUrl
                ? <img src={coverUrl} alt={book.title} className="w-full h-full object-cover"/>
                : <span className="text-xs font-medium p-1.5 leading-tight opacity-70 line-clamp-2">{book.title}</span>
            }
        </div>
    );
};

export const HomePage = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [recentlyAddedBooks, setRecentlyAddedBooks] = useState([]);
    const [topRatedBooks, setTopRatedBooks] = useState([]);
    const [recentReviews, setRecentReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recentlyAdded, topRated, recent] = await Promise.all([
                    bookService.getRecentlyAddedBooks(3),
                    bookService.getTopRatedBooks(4),
                    reviewService.getRecentReviews(5)
                ]);
                setRecentlyAddedBooks(recentlyAdded)
                setTopRatedBooks(topRated)
                setRecentReviews(recent)
            } catch (err) {
                console.error('Failed to fetch homepage data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) navigate(`/books?search=${encodeURIComponent(query.trim())}`);
    };

    const heroBooks = [recentlyAddedBooks[2], topRatedBooks[0], recentlyAddedBooks[1]].filter(Boolean);

    const initials = (name) => name ? name.slice(0, 2).toUpperCase() : '??';
    const avatarColors = ['bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 'bg-pink-100 text-pink-700', 'bg-blue-100 text-blue-700'];

    if (loading) return <div className="max-w-7xl mx-auto px-4 py-16 text-gray-400 text-center">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

            {/* Hero */}
            <div className="bg-gray-50 rounded-2xl px-8 py-10 flex items-center justify-between gap-8">
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Book Review</p>
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
                        Discover your next<br/>favourite book
                    </h1>
                    <p className="text-gray-500 text-sm mb-6 max-w-sm leading-relaxed">
                        Real reviews from real readers. Find, rate and discuss books you love.
                    </p>
                    <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search by title or author..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>
                <div className="hidden md:flex gap-3 flex-shrink-0">
                    {heroBooks.map((book, i) => (
                        <Link to={`/books/${book.id}`} key={book.id}>
                            <BookCover
                                book={book}
                                className={`w-20 h-28 cursor-pointer hover:scale-105 transition-transform ${i === 1 ? 'mt-4' : ''}`}
                            />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Top Rated */}
            {topRatedBooks.length > 0 && (
                <div>
                    <div className="flex justify-between items-baseline mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Top rated</h2>
                        <Link to="/books" className="text-sm text-blue-500 hover:text-blue-600">View all</Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {topRatedBooks.map(book => (
                            <Link to={`/books/${book.id}`} key={book.id}
                                  className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                <BookCover book={book} className="w-full h-28"/>
                                <div className="p-3">
                                    <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                                    <p className="text-xs text-gray-500 truncate mb-1.5">
                                        {book.authors?.map(a => a.fullName).join(', ')}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <StarRating rating={book.avgRating}/>
                                        <span className="text-xs text-gray-400">· {book.reviewCount} reviews</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Recently Added */}
            {recentlyAddedBooks.length > 0 && (
                <div>
                    <div className="flex justify-between items-baseline mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Recently added</h2>
                        <Link to="/books" className="text-sm text-blue-500 hover:text-blue-600">View all</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recentlyAddedBooks.map(book => (
                            <Link to={`/books/${book.id}`} key={book.id}
                                  className="bg-white border border-gray-100 rounded-xl p-3 flex gap-3 items-start hover:shadow-md transition-shadow">
                                <BookCover book={book} className="w-12 h-16 flex-shrink-0"/>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                                    <p className="text-xs text-gray-500 truncate mb-1.5">
                                        {book.authors?.map(a => a.fullName).join(', ')}
                                    </p>
                                    <span
                                        className="inline-block text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">
                                        {book.genre}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Latest Reviews */}
            {recentReviews.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Latest reviews</h2>
                    <div className="space-y-3">
                        {recentReviews.map((review, i) => (
                            <Link to={`/books/${review.bookId}`} key={review.id}
                                  className="flex gap-3 items-start bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                                    {initials(review.username)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-sm font-medium text-gray-900">{review.username}</span>
                                        <span className="text-xs text-gray-400">{review.date}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                                        on <span
                                        className="text-gray-700 font-medium">{review.bookTitle}</span> — {review.comment}
                                    </p>
                                </div>
                                <StarRating rating={review.rating}/>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};