const router = require("express").Router();
const mongoose = require('mongoose');
const {PublicBookshelf} = require("../models/PublicBookshelf.model")
const {PublicShelf} = require("../models/PublicBookshelf.model")

const User = require('../models/User.model')

const {whatShelf} = require("../middleware/movingHelpers")
const {staticToStatic} = require("../middleware/movingHelpers")
const {staticToDynamic} = require("../middleware/movingHelpers")
const {dynamicToStatic} = require("../middleware/movingHelpers")
const {dynamicToDynamic} = require("../middleware/movingHelpers")


// PATH /api/public-shelves



 // CREATE PUBLIC SHELF AND APPEND TO PUBLIC BOOKSHELF

router.get("/create", (req, res) => {
    res.json("this is my Create PublicShelf page.")
});
  
  
router.post("/create", (req, res) => {
    const {name, books, publicBookshelf} = req.body
  
    PublicShelf.create({
      name,
      books,
      publicBookshelf
    })
    .then(createdShelf => {
      PublicBookshelf.findByIdAndUpdate(publicBookshelf, {$addToSet: {dynamicShelves: createdShelf._id}}, {new:true})
      .then(user => res.json(user))
    })

});


// MOVE BOOK FROM SHELF TO SHELF

router.put("/moveBook", (req, res) => {
  const {bookshelfId, shelfFrom, shelfTo, booksFrom, booksTo} = req.body
  let result;

  switch(whatShelf(shelfFrom) | whatShelf(shelfTo)) {
    case "static" | "static":
      result = staticToStatic({bookshelfId, shelfFrom, shelfTo, booksFrom, booksTo})
      break;
    case "static" | "dynamic":
      result = staticToDynamic({bookshelfId, shelfFrom, shelfTo, booksFrom, booksTo}, "public")
      break;
    case "dynamic" | "static":
      result = dynamicToStatic({bookshelfId, shelfFrom, shelfTo, booksFrom, booksTo}, "public")
      break;
    case "dynamic" | "dynamic":
      result = dynamicToDynamic({shelfFrom, shelfTo, booksFrom, booksTo}, "public")
      break;
    default: 
      result = res.status(400).json({ message: 'At least one of the shelves does not exist' });

  }

  return result

})



  
  


// EDIT PUBLIC SHELF
  
router.get("/:shelfId/edit", (req, res) => {
    res.json("this is my Edit PublicShelf page. ")
});
  


router.put("/:shelf/edit", (req, res) => {
    const { shelf } = req.params;
    const {bookshelfId, name, books} = req.body


    if(shelf === "currentlyReading" || shelf === "wantToRead" || shelf === "read") {

      PublicBookshelf.findByIdAndUpdate(bookshelfId, {shelf: books}, {new: true}).populate('dynamicShelves')
      .then(editedShelf => res.json(editedShelf))

    } else if (!mongoose.Types.ObjectId.isValid(shelf)) {

      res.status(400).json({ message: 'Specified shelf does not exist' });
      return;

    } else {
  
      PublicShelf.findByIdAndUpdate(shelf, {
        name,
        books, 
      }, {new: true})
      .populate('books')
      .then(editedShelf => res.json(editedShelf))

    }

});
  



//DELETE PUBLIC SHELF
  
router.delete("/:shelfId/delete", (req, res) => {
    const {shelfId} = req.params
    if (!mongoose.Types.ObjectId.isValid(shelfId)) {
        return res.status(400).json({ message: 'Specified shelf does not exist' });
    }
       

    PublicShelf.findByIdAndRemove(shelfId)
    .then(() => res.json({ message: `Shelf was successfully removed.` }))
    .catch(err => res.json(err));

      
})



// RETURN SHELF DETAILS
router.post("/:shelf", (req, res) => {
    const {shelf} = req.params
    const {bookshelfId} = req.body

    if(shelf === "currentlyReading" || shelf === "wantToRead" || shelf === "read") {
        return PublicBookshelf.findById(bookshelfId)
        .then(bookshelf => res.json(bookshelf[shelf]))
        .catch(err => console.log(err))
    }

    else if (!mongoose.Types.ObjectId.isValid(shelf)) {return res.status(400).json({ message: 'Specified shelf does not exist' })}

    else {
        return PublicShelf.findById(shelf)
        .populate("books")
        .then(foundShelf => res.json(foundShelf.books))
        .catch(err => console.log(err))
    }


});


module.exports = router;

      