const { Schema, model } = require('mongoose');

// PRIVATE SHELVES

const privateShelfSchema = new Schema(
	{
		name: String,
		ebooks: [{ type: Schema.Types.ObjectId, ref: "Ebook", default: [] }],
		privateBookshelf: { type: Schema.Types.ObjectId, ref: "PrivateBookshelf" },
	}
)
const PrivateShelf = model('PrivateShelf', privateShelfSchema)


// PRIVATE BOOKSHELF


const privateBookshelfSchema = new Schema(
	{
		name: String,
		staticShelf: [{ type: Schema.Types.ObjectId, ref: "Ebook", default: [] }],
		dynamicShelves: [{ type: Schema.Types.ObjectId, ref: "PrivateShelf" }],
		owner: { type: Schema.Types.ObjectId, ref: "User" }
	},
	{
		timestamps: true
	}
);

const PrivateBookshelf = model('PrivateBookshelf', privateBookshelfSchema);



module.exports = {PrivateBookshelf: PrivateBookshelf, PrivateShelf: PrivateShelf};
