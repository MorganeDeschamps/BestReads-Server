const { Schema, model } = require('mongoose');


const publicBookshelfSchema = new Schema(
	{
		name: String,
		shelves: [
			{"Currently reading": [String]},
			{"Want to read": [String]},
			{"Read": [String]},
			{
				name: String,
				books: [String]
			}
		],
		owner: { type: Schema.Types.ObjectId, ref: "User" }
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

module.exports = {PublicBookshelf: PublicBookshelf, PrivateBookshelf: PrivateBookshelf};
