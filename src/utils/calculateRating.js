export const calculateRating = reviews => {
    if(!reviews || reviews.length === 0 ) return 0;

    const reviewsArray = Object.values(reviews);

    const sum = reviewsArray.reduce((acc, review) => acc + review.rating, 0);

    return sum / reviewsArray.length;
};