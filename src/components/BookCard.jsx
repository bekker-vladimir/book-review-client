import React from 'react';
import {Link} from "react-router-dom";
import {calculateRating} from "../utils/calculateRating";

export const BookCard = ({book}) => {
    const reviewsArray = book?.reviews ? Object.values(book.reviews) : [];
    const rating = calculateRating(reviewsArray);

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{book?.title}</h3>
                <p className="text-gray-500 mb-4">{book?.genre}</p>
            </div>
            <div className="mt-auto">
                <div className="flex items-center mb-4">
                    <span className="text-yellow-400 mr-2">★</span>
                    <span>{rating.toFixed(1)} ({reviewsArray.length} reviews)</span>
                </div>
                <Link
                    to={`/books/${book?.id}`}
                    className="block w-full text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};
