import React from 'react';
import {Link} from 'react-router-dom';
import {bookService} from '../services/bookService';

const colors = ['bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-purple-100', 'bg-amber-100', 'bg-teal-100'];

export const BookCard = ({book}) => {
    const coverUrl = bookService.getCoverUrl(book.coverUrl);
    const color = colors[book.id % colors.length];

    return (
        <Link to={`/books/${book.id}`}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div className={`rounded-t-xl overflow-hidden flex items-end ${color} w-full h-36`}>
                {coverUrl
                    ? <img src={coverUrl} alt={book.title} className="w-full h-full object-cover"/>
                    :
                    <span className="text-xs font-medium p-2 leading-tight opacity-60 line-clamp-3">{book.title}</span>
                }
            </div>
            <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                <p className="text-xs text-gray-400 truncate mb-1">
                    {book.authors?.map(a => a.fullName).join(', ')}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {book.genre}
                    </span>
                    {book.reviewCount > 0 && (
                        <span className="text-xs text-amber-500 font-medium">★ {book.avgRating?.toFixed(1)}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};