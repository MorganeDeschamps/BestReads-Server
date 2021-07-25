const router = require("express").Router();
const mongoose = require('mongoose');
const {PrivateBookshelf} = require("../models/PrivateBookshelf.model")
const User = require('../models/User.model')



//BOOKSHELF MAIN

router.get("/", (req, res) => {
  res.json("BookShelf main - All good in here");
});

// GET PRIVATE BOOKSHELF BY ID

router.get("/:bookshelfId", (req, res) => {
  const { bookshelfId } = req.params; 
 
  if (!mongoose.Types.ObjectId.isValid(bookshelfId)) {
    res.status(400).json({ message: 'Specified bookshelf does not exist' }); 
    return;
  }
 
  PrivateBookshelf.findById(bookshelfId)
    .populate('owner')
    .populate('staticShelf')
    .populate('dynamicShelves')
    .then(privateBookshelf => res.json(privateBookshelf))
    .catch(err => res.json(err));
});



// CREATE PRIVATE BOOKSHELF AND APPEND TO USER

router.get("/create", (req, res) => {
  res.json("this is my createBookShelf page. ")
});


router.post("/create", (req, res) => {
  let {name, staticShelf, owner} = req.body

  PrivateBookshelf.create({
    name, 
    staticShelf, 
    owner
  })
  .then(createdBookshelf => {
    User.findByIdAndUpdate(owner, {$addToSet: {privateBookshelf: createdBookshelf._id}}, {new:true})
    .then(user => {
      console.log(user)
      res.json(createdBookshelf)
    })
  })
});


//EDIT PRIVATE BOOKSHELF

router.get("/:bookshelfId/edit", (req, res) => {
  res.json("this is my private editBookshelf page. ")
})


router.put("/:bookshelfId/edit", (req, res) => {
  const { bookshelfId } = req.params;
  const {name, dynamicShelves} = req.body

  if (!mongoose.Types.ObjectId.isValid(bookshelfId)) {
    res.status(400).json({ message: 'Specified bookshelf does not exist' });
    return;
  }
 
  PrivateBookshelf.findByIdAndUpdate(bookshelfId, {
      name,
      dynamicShelves
    }, {new: true})
    .populate("dynamicShelves")
    .then((editedBookshelf) => res.json(editedBookshelf))
    .catch(error => res.json(error));

})


//TESTING
router.get("/test/:bookId", (req, res, next) => {
  res.json(req.params.bookId);
});




module.exports = router;
