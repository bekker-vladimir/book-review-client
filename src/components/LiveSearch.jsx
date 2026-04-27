import React, {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {bookService} from '../services/bookService';
import {Search, Loader2} from 'lucide-react';

export const LiveSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (query.trim().length === 0) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const timeoutId = setTimeout(async () => {
            try {
                const data = await bookService.searchBooks(query);
                setResults(Array.isArray(data) ? data : data.content || []);
            } catch (error) {
                console.error("Search failed:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleResultClick = (id) => {
        setShowDropdown(false);
        setQuery('');
        navigate(`/books/${id}`);
    };

    const colors = ['bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-purple-100', 'bg-amber-100', 'bg-teal-100'];

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search books..."
                    className="w-full pl-8 pr-3 py-1 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300"
                />
                <div className="absolute left-2.5 top-2 text-gray-400">
                    <Search size={14}/>
                </div>
                {isLoading && (
                    <div className="absolute right-2.5 top-2 text-blue-400">
                        <Loader2 size={14} className="animate-spin"/>
                    </div>
                )}
            </div>

            {showDropdown && query.trim().length > 0 && (
                <div
                    className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            Searching...
                        </div>
                    ) : results.length > 0 ? (
                        <ul className="py-2">
                            {results.map((book) => (
                                <li
                                    key={book.id}
                                    onClick={() => handleResultClick(book.id)}
                                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3"
                                >
                                    <div className={`w-10 h-14 rounded flex-shrink-0 overflow-hidden flex items-end ${colors[book.id % colors.length]}`}>
                                        {book.coverUrl
                                            ? <img src={bookService.getCoverUrl(book.coverUrl)} alt="" className="w-full h-full object-cover"/>
                                            : <span className="text-xs p-1 opacity-50 font-medium leading-tight line-clamp-2">{book.title}</span>
                                        }
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{book.title}</div>
                                        <div className="text-xs text-gray-400 truncate mt-0.5">
                                            {book.authors?.map(a => a.fullName).join(', ') || 'Unknown Author'}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            No books found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
