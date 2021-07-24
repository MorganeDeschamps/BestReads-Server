const router = require('express').Router();

//Cloudinary
const fileUploader = require('../config/cloudinary.config');


/* GET home page */
router.get("/", (req, res, next) => {
	res.json("All good in here");
});



// POST '/api/upload' => Route that will receive an image, send it to Cloudinary via the fileUploader and return the image URL
router.post('/', fileUploader.single('imageUrl'), (req, res, next) => {
	// console.log('file is: ', req.file)
   
	if (!req.file) {
	  next(new Error('No file uploaded!'));
	  return;
	}
	// get the URL of the uploaded file and send it as a response.
	// 'secure_url' can be any name, just make sure you remember to use the same when accessing it on the frontend
   
	res.json({ secure_url: req.file.path });
  });
   
  

  
module.exports = router;