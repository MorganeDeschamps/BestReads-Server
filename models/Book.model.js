const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const bookSchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		author: {
			type: [String],
			required: true
		},
		coverUrl: String,
	},
	{
		timestamps: true
	}
);

const Book = model('Book', bookSchema);

module.exports = Book;
