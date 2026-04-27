import {useState} from "react";
import {reviewService} from "../services/reviewService";

const LABELS = ['', 'Terrible', 'Not great', 'Okay', 'Good', 'Excellent'];

export const ReviewForm = ({bookId, onReviewAdded}) => {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating) return alert('Please select a rating');
        try {
            const newReview = await reviewService.createReview({rating, comment}, bookId);
            onReviewAdded(newReview);
            setRating(0);
            setComment('');
        } catch (error) {
            alert(error.response?.data?.message || `Failed to submit review: ${error.message}`);
        }
    };

    const active = hovered || rating;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <p className="text-xs text-gray-400 mb-2">Your rating</p>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(val => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => setRating(val)}
                            onMouseEnter={() => setHovered(val)}
                            onMouseLeave={() => setHovered(0)}
                            className={`text-3xl leading-none transition-transform hover:scale-110 
                                ${val <= active ? 'text-amber-400' : 'text-gray-200'}`}
                        >★</button>
                    ))}
                    <span className="text-xs text-gray-400 ml-2">
                        {active ? `— ${LABELS[active]}` : '— not rated'}
                    </span>
                </div>
            </div>
            <div>
                <p className="text-xs text-gray-400 mb-2">Your review</p>
                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Share your thoughts about this book..."
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 resize-none transition-all"
                />
            </div>
            <div className="flex justify-end">
                <button type="submit"
                        className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Submit review
                </button>
            </div>
        </form>
    );
};