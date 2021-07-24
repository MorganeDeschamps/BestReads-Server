const router = require("express").Router();
const mongoose = require('mongoose');
const Book = require("../models/Book.model");


//BOOK
router.get("/", (req, res, next) => {
  res.json("Book main - All good in here");
});


//CREATE BOOK
router.get("/create", (req, res, next) => {
  res.json("this is my createBook page. ")
})


router.post("/create", (req, res, next) => {
  const { title, author, coverUrl, epubUrl} = req.body

  Book.create({
      title,
      author,
      coverUrl, 
      epubUrl
  })
  .then(createdBook => res.json(createdBook))
  .catch(err=>res.json(err))
});





//DISPLAY ONE BOOK
router.get("/:bookId", (req, res, next) => {
  const id = req.params.bookId

  Book.findById(id)
  .then(bookResult => res.json(bookResult))
  .catch(err => res.json(err))

})



//EDIT BOOK PAGE
router.get("/:bookId/edit", (req, res, next) => {
  res.json("this is my editBook page. ")
})


router.put("/:bookId/edit", (req, res, next) => {
  const { bookId } = req.params;
  const { title, author, coverUrl, epubUrl } = req.body

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
 
  Book.findByIdAndUpdate(bookId, { title, author, coverUrl, epubUrl }, {new: true})
    .then((editedBook) => res.json(editedBook))
    .catch(error => res.json(error));

})





//DELETE BOOK
router.delete("/:bookId", (req, res, next) => {
  const { bookId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
 
  Book.findByIdAndRemove(bookId)
    .then(() => res.json({ message: `Book with ${bookId} is removed successfully.` }))
    .catch(error => res.json(error));

})




//TESTING
router.get("/test/:bookId", (req, res, next) => {
  res.json(req.params.bookId);
});




module.exports = router;
