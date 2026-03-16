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

    return (
        <div className="relative w-full max-w-sm" ref={dropdownRef}>
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
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                    <Search size={20}/>
                </div>
                {isLoading && (
                    <div className="absolute right-3 top-2.5 text-blue-500">
                        <Loader2 size={20} className="animate-spin"/>
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
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150 ease-in-out"
                                >
                                    <div className="font-medium text-gray-800">{book.title}</div>
                                    <div className="text-sm text-gray-500">
                                        {book.authors?.map(a => a.fullName).join(', ') || 'Unknown Author'}
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
