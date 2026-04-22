import React, {useState, useEffect, useCallback} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import {bookService} from '../services/bookService';
import {useAuth} from '../context/AuthContext';
import {ChevronLeft, ChevronRight} from 'lucide-react';

const PAGE_SIZE = 20;

const BookCover = ({book, className = ''}) => {
    const coverUrl = bookService.getCoverUrl(book.coverUrl);
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-purple-100', 'bg-amber-100', 'bg-teal-100'];
    const color = colors[book.id % colors.length];
    return (
        <div className={`rounded-t-xl overflow-hidden flex items-end ${color} ${className}`}>
            {coverUrl
                ? <img src={coverUrl} alt={book.title} className="w-full h-full object-cover"/>
                : <span className="text-xs font-medium p-2 leading-tight opacity-60 line-clamp-3">{book.title}</span>
            }
        </div>
    );
};

const avgRating = (reviews) => {
    if (!reviews?.length) return null;
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
};

const Pagination = ({page, totalPages, onPageChange}) => {
    if (totalPages <= 1) return null;

    // Show: first, last, current ±1, ellipsis elsewhere
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
        if (i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...');
        }
    }

    return (
        <div className="flex items-center justify-center gap-1 mt-8">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 0}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={16}/>
            </button>

            {pages.map((p, i) =>
                p === '...'
                    ? <span key={`el-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                    : <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors
                            ${p === page
                            ? 'bg-blue-500 text-white'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        {p + 1}
                    </button>
            )}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={16}/>
            </button>
        </div>
    );
};

export const BooksPage = () => {
    const {isAdminOrMod} = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const searchQuery = searchParams.get('search') || '';
    const currentPage = parseInt(searchParams.get('page') || '0', 10);

    const [inputValue, setInputValue] = useState(searchQuery);
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sync input when URL changes (e.g. navigating from HomePage search)
    useEffect(() => {
        setInputValue(searchQuery);
    }, [searchQuery]);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = searchQuery
                ? await bookService.searchBooks(searchQuery, currentPage, PAGE_SIZE)
                : await bookService.getAllBooks(currentPage, PAGE_SIZE);
            console.log('fetchBooks response:', data);
            setPageData(data);
        } catch {
            setError('Failed to fetch books');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, currentPage]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleSearch = (e) => {
        e.preventDefault();
        const q = inputValue.trim();
        setSearchParams(q ? {search: q, page: '0'} : {});
    };

    const handlePageChange = (newPage) => {
        const params = {};
        if (searchQuery) params.search = searchQuery;
        params.page = String(newPage);
        setSearchParams(params);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const books = pageData?.content ?? [];
    const totalPages = pageData?.page?.totalPages ?? pageData?.totalPages ?? 0;
    const totalItems = pageData?.page?.totalElements ?? pageData?.totalElements ?? 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">All Books</h1>
                {!loading && (
                    <span className="text-sm text-gray-400">{totalItems} books</span>
                )}
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-sm">
                <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Search by title or author..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
                <button type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                    Search
                </button>
                {searchQuery && (
                    <button type="button"
                            onClick={() => {
                                setSearchParams({});
                                setInputValue('');
                            }}
                            className="px-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                        ✕
                    </button>
                )}
            </form>

            {loading ? (
                <div className="py-16 text-gray-400 text-center text-sm">Loading...</div>
            ) : error ? (
                <div className="py-8 text-red-500 text-sm">{error}</div>
            ) : books.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                    {searchQuery ? `No books found for "${searchQuery}"` : 'No books yet.'}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {books.map(book => {
                            const rating = avgRating(book.reviews);
                            return (
                                <Link to={`/books/${book.id}`} key={book.id}
                                      className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                    <BookCover book={book} className="w-full h-36"/>
                                    <div className="p-3">
                                        <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                                        <p className="text-xs text-gray-400 truncate mb-1">
                                            {book.authors?.map(a => a.fullName).join(', ')}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                                {book.genre}
                                            </span>
                                            {rating && (
                                                <span className="text-xs text-amber-500 font-medium">★ {rating}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                        {isAdminOrMod && currentPage === 0 && (
                            <Link to="/books/add"
                                  className="bg-white border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center h-full min-h-[180px] hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                                <div
                                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                                    <span className="text-blue-500 text-xl font-light">+</span>
                                </div>
                                <span className="text-sm text-blue-500 font-medium">Add Book</span>
                            </Link>
                        )}
                    </div>

                    <Pagination
                        page={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};