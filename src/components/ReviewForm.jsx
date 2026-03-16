import {useState} from "react";
import {reviewService} from "../services/reviewService";

export const ReviewForm = ({bookId, onReviewAdded}) => {
    const [review, setReview] = useState({
        rating: 1,
        comment: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newReview = await reviewService.createReview(review, bookId);
            onReviewAdded(newReview);
            setReview({rating: 1, comment: ''});
        } catch (error) {
            console.error('Failed to submit review:', error);
            alert(error.response?.data?.message || `Failed to submit review: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select
                    value={review.rating}
                    onChange={(e) => setReview({...review, rating: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                    {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} Stars</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                <textarea
                    value={review.comment}
                    onChange={(e) => setReview({...review, comment: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all min-h-[100px] whitespace-pre-wrap"
                    placeholder="Write your review here..."
                    rows={4}
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Submit Review
            </button>
        </form>
    );
};