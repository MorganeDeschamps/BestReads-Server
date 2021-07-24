const { Schema, model } = require('mongoose');


const shelfSchema = new Schema(
	{
		name: String,
		createdShelf: [String]
	}
)
const Shelf = model('Shelf', shelfSchema)




const publicBookshelfSchema = new Schema(
	{
		name: String,
		currentlyReading: [String],
		wantToRead: [String],
		read: [String,],
		newShelf: { type: Schema.Types.ObjectId, ref: "Shelf" },
		owner: { type: Schema.Types.ObjectId, ref: "User" }


/* 		shelves: [
			{"Currently reading": [String]},
			{"Want to read": [String]},
			{"Read": [String]},
			{
				name: String,
				books: [String]
			}
		], */
	},
	{
		timestamps: true
	}
);

const PublicBookshelf = model('PublicBookshelf', publicBookshelfSchema);





const privateBookshelfSchema = new Schema(
	{
		name: String,
		shelves: [{
			name: String,
			books: [{ type: Schema.Types.ObjectId, ref: "Ebook" }]
		}],
		owner: { type: Schema.Types.ObjectId, ref: "User" }
	},
	{
		timestamps: true
	}
);

const PrivateBookshelf = model('PrivateBookshelf', privateBookshelfSchema);

module.exports = {PublicBookshelf: PublicBookshelf, PrivateBookshelf: PrivateBookshelf, Shelf: Shelf};
