const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String, required: true },
    bookId: { type: String, required: true }
});

const Review = model('Review', reviewSchema);
module.exports = Review;