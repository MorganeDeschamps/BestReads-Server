const router = require("express").Router();
const mongoose = require('mongoose');
const Ebook = require("../models/Ebook.model");
const {PrivateBookshelf} = require("../models/Bookshelf.model")
const {PublicBookshelf} = require("../models/Bookshelf.model")
const User = require('../models/User.model')


//BOOKSHELF MAIN
router.get("/", (req, res, next) => {
  res.json("BookShelf main - All good in here");
});


// GET PRIVATE BOOKSHELF BY ID

router.get("/private/:bookshelfId", (req, res) => {
  const { bookshelfId } = req.params; 
 
  if (!mongoose.Types.ObjectId.isValid(bookshelfId)) {
    res.status(400).json({ message: 'Specified bookshelf does not exist' }); 
    return;
  }
 
  PrivateBookshelf.findById(bookshelfId)
    .populate('owner')
    .populate('books')
    .then(privateShelf => res.json(privateShelf))
    .catch(err => res.json(err));
});


//GET PUBLIC BOOKSHELF BY ID

router.get("/public/:bookshelfId", (req, res) => {
  const { bookshelfId } = req.params; 
 
  if (!mongoose.Types.ObjectId.isValid(bookshelfId)) {
    res.status(400).json({ message: 'Specified bookshelf does not exist' }); 
    return;
  }
 
  PublicBookshelf.findById(bookshelfId)
    .populate('owner')
    .then(publicShelf => res.json(publicShelf))
    .catch(err => res.json(err));
});




// CREAT PRIVATE BOOKSHELF AND APPEND TO USER

router.get("/private/create", (req, res) => {
  res.json("this is my createBookShelf page. ")
});


router.post("/private/create", (req, res) => {
  const shelfName = req.body.shelves.name
  const shelfBooks = req.body.shelves.books
  const {name, owner} = req.body

  PrivateBookshelf.create({
      name,
      shelfName,
      shelfBooks, // is this going to be accessing the array of books? We have not populated
      owner
  })
  .then(createdBookshelf => {
    User.findByIdAndUpdate(owner, {$addToSet: {privateBookshelf: createdBookshelf._id}}, {new:true})
    .then(user => res.json(user))
  })
});




// CREAT PUBLIC BOOKSHELF AND APPEND TO USER

router.get("/public/create", (req, res) => {
  res.json("this is my createBookShelf page. ")
});


router.post("/public/create", (req, res) => {
  const shelfName = req.body.shelves.name
  const shelfBooks = req.body.shelves.books
  const {name, owner} = req.body
  // the above need to be edited depending on the model
  //easier to have a seperate into seperate model?

  PublicBookshelf.create({
      name, // these will all need to be edited
      shelfName,
      shelfBooks, 
      owner
  })
  .then(createdBookshelf => {
    User.findByIdAndUpdate(owner, {$addToSet: {publicBookshelf: createdBookshelf._id}}, {new:true})
    .then(user => res.json(user))
  })
});



/* //DISPLAY ONE BOOKSHELF
router.get("/:bookshelfId", (req, res, next) => {
  const id = req.params.bookId

  Book.findById(id)
  .then(bookResult => res.json(bookResult))
  .catch(err => res.json(err))

}) */



/* 
//CREATE BOOKSHELF
router.get("/create", (req, res) => {
  res.json("this is my createBookShelf page. ")
})


router.post("/create", (req, res) => {
  const {name, books} = req.body

  PrivateBookshelf.create({
      name,
      books
  })
  .then(createdBookshelf => res.json(createdBookshelf))
  .catch(err=>res.json(err))
}); */


/* 
//DISPLAY ONE BOOKSHELF
router.get("/:bookshelfId", (req, res, next) => {
  const id = req.params.bookshelfId

  PrivateBookshelf.findById(id)
  .populate()
  .then(bookshelfResult => res.json(bookshelfResult))
  .catch(err => res.json(err))

}) */



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


//EDIT PRIVATE BOOKSHELF
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


//CREATE A SHELF AND APPEND TO BOOKSHELF


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
