const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const ebookSchema = new Schema(
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
        ebookUrl: String,
		owner: { type: Schema.Types.ObjectId, ref: "User" }
	},
	{
		timestamps: true
	}
);

const Ebook = model('Ebook', ebookSchema);

module.exports = Ebook;
