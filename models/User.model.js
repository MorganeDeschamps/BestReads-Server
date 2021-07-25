const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		password: String,
		imageUrl: {
			type: String,
			default: "../public/matilda.jpeg"
		},
		publicBookshelf: {type: Schema.Types.ObjectId, ref: "PublicBookshelf"},

		privateBookshelf: {type: Schema.Types.ObjectId, ref: "PrivateBookshelf"},
		
		reviews: [{type: Schema.Types.ObjectId, ref: "Review"}]
	},
	{
		timestamps: true
	}
);

const User = model('User', userSchema);

module.exports = User;
