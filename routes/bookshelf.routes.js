const router = require("express").Router();
const mongoose = require('mongoose');
const {PrivateBookshelf} = require("../models/Bookshelf.model")
const {PublicBookshelf} = require("../models/Bookshelf.model")
const {Shelf} = require("../models/Bookshelf.model")
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
      shelfBooks, // is this going to be accessing the array of books? We have not populated, do we have access?
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
  const {name, currentlyReading, wantToRead, read, newShelf, owner} = req.body


  PublicBookshelf.create({
      name,
      currentlyReading,
      wantToRead,
      read,
      newShelf, // does this need to be populated somewhere?
      owner
  })
  .then(createdBookshelf => {
    User.findByIdAndUpdate(owner, {$addToSet: {publicBookshelf: createdBookshelf._id}}, {new:true})
    .then(user => res.json(user))
  })
});




//EDIT PRIVATE BOOKSHELF - EDIT NAME

router.get("/private/:bookshelfId/edit", (req, res) => {
  res.json("this is my editBook page. ")
})


router.put("/private/:bookshelfId/edit", (req, res) => {
  const { bookshelfId } = req.params;
  const shelfName = req.body.shelves.name
  const shelfBooks = req.body.shelves.books
  const {name, owner} = req.body

  if (!mongoose.Types.ObjectId.isValid(bookshelfId)) {
    res.status(400).json({ message: 'Specified bookshelf does not exist' });
    return;
  }
 
  PrivateBookshelf.findByIdAndUpdate(bookshelfId, {
    name,
    shelfName,
    shelfBooks,
    owner
}, {new: true})
    .then((editedBookshelf) => res.json(editedBookshelf))
    .catch(error => res.json(error));

})



//EDIT PUBLIC BOOKSHELF

router.get("/public/:bookshelfId/edit", (req, res) => {
  res.json("this is my editBook page. ")
})


router.put("/public/:bookshelfId/edit", (req, res) => {
  const { bookshelfId } = req.params;
  const {name, currentlyReading, wantToRead, read, newShelf, owner} = req.body


  if (!mongoose.Types.ObjectId.isValid(bookshelfId)) {
    res.status(400).json({ message: 'Specified bookshelf does not exist' });
    return;
  }
 
  PublicBookshelf.findByIdAndUpdate(bookshelfId, {
    name,
    currentlyReading,
    wantToRead,
    read,
    newShelf, // does this need to be populated somewhere?
    owner
}, {new: true})
    .then((editedBookshelf) => res.json(editedBookshelf))
    .catch(error => res.json(error));

})


//DELETE PRIVATE BOOKSHELF
router.delete("/private/:bookshelfId/delete", (req, res, next) => {
  const { bookshelfId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(bookshelfId)) {
    res.status(400).json({ message: 'Specified bookshelf does not exist' });
    return;
  }
 
  PrivateBookshelf.findByIdAndRemove(bookshelfId)
    .then(() => res.json({ message: `Bookshelf removed successfully.` }))
    .catch(error => res.json(error));

})


//DELETE PUBLIC BOOKSHELF
router.delete("/public/:bookshelfId/delete", (req, res, next) => {
  const { bookshelfId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(bookshelfId)) {
    res.status(400).json({ message: 'Specified bookshelf does not exist' });
    return;
  }
 
  PublicBookshelf.findByIdAndRemove(bookshelfId)
    .then(() => res.json({ message: `Bookshelf removed successfully.` }))
    .catch(error => res.json(error));

})



// CREAT SHELF AND APPEND TO PRIVATE BOOKSHELF

router.get("/private/shelf/create", (req, res) => {
  res.json("this is my createShelf page. ")
});


router.post("/private/shelf/create", (req, res) => {
  const {name, createdShelf, privateBookshelf} = req.body

  Shelf.create({
    name,
    createdShelf,
    privateBookshelf
  })
  .then(createdShelf => {
    PrivateBookshelf.findByIdAndUpdate(privateBookshelf, {$addToSet: {createdShelf: createdShelf._id}}, {new:true})
    .then(user => res.json(user))
  })
});




// CREAT SHELF AND APPEND TO PUBLIC BOOKSHELF

router.get("/public/shelf/create", (req, res) => {
  res.json("this is my createShelf page. ")
});


router.post("/public/shelf/create", (req, res) => {
  const {name, createdShelf, publicBookshelf} = req.body

  Shelf.create({
    name,
    createdShelf,
    publicBookshelf
  })
  .then(createdShelf => {
    publicBookshelf.findByIdAndUpdate(publicBookshelf, {$addToSet: {createdShelf: createdShelf._id}}, {new:true})
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



/* //EDIT BOOK PAGE
router.get("/:bookshId/edit", (req, res, next) => {
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

}) */



/* //DELETE BOOK
router.delete("/:bookId", (req, res, next) => {
  const { bookId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
 
  Book.findByIdAndRemove(bookId)
    .then(() => res.json({ message: `Book with ${bookId} is removed successfully.` }))
    .catch(error => res.json(error));

}) */




//TESTING
router.get("/test/:bookId", (req, res, next) => {
  res.json(req.params.bookId);
});




module.exports = router;
