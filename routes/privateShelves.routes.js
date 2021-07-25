const router = require("express").Router();
const mongoose = require('mongoose');
const {PrivateBookshelf} = require("../models/PrivateBookshelf.model")
const {PrivateShelf} = require("../models/PrivateBookshelf.model")

const User = require('../models/User.model')

const {staticToDynamic} = require("../middleware/movingHelpers")
const {dynamicToStatic} = require("../middleware/movingHelpers")
const {dynamicToDynamic} = require("../middleware/movingHelpers")


//PATH /api/private-shelves


// CREATE PRIVATE SHELF AND APPEND TO PRIVATE BOOKSHELF
router.get("/create", (req, res) => {
    res.json("this is my Private createShelf page. ")
});
  
  
router.post("/create", (req, res) => {
    const {name, ebooks, privateBookshelf} = req.body
  
    PrivateShelf.create({
      name,
      ebooks,
      privateBookshelf
    })
    .then(createdShelf => {
      PrivateBookshelf.findByIdAndUpdate(privateBookshelf, {$addToSet: {dynamicShelves: createdShelf._id}}, {new:true})
      .then(bookshelf => res.json(createdShelf))
    })

});



  
//MOVE BOOK FROM SHELF TO SHELF
router.put("/moveBook", (req, res) => {
    const {bookshelfId, shelfFrom, shelfTo, booksFrom, booksTo} = req.body
    let result;
  
    switch(whatShelf(shelfFrom) | whatShelf(shelfTo)) {
      case "static" | "dynamic":
        result = staticToDynamic({bookshelfId, shelfFrom, shelfTo, booksFrom, booksTo}, "private")
        break;
      case "dynamic" | "static":
        result = dynamicToStatic({bookshelfId, shelfFrom, shelfTo, booksFrom, booksTo}, "private")
        break;
      case "dynamic" | "dynamic":
        result = dynamicToDynamic({shelfFrom, shelfTo, booksFrom, booksTo}, "private")
        break;
      default: 
        result = res.status(400).json({ message: 'At least one of the shelves does not exist' });
  
    }
  
    return result
  
})
  
  

// EDIT PRIVATE SHELF
  
router.get("/:shelfId/edit", (req, res) => {
    res.json("this is my Edit PrivateShelf page. ")
});
  
  
router.put("/:shelfId/edit", (req, res) => {
    const { shelfId } = req.params;
    const {name, ebooks} = req.body
  
    if (!mongoose.Types.ObjectId.isValid(shelfId)) {
      res.status(400).json({ message: 'Specified shelf does not exist' });
      return;
    }
  
    PrivateShelf.findByIdAndUpdate(shelfId, {
      name,
      ebooks, 
    }, {new: true})
    .populate('ebooks')
    .then(editedShelf => res.json(editedShelf))
    .catch(err => res.json(err))

});
  



//DELETE PRIVATE SHELF
  
router.delete("/:shelfId/delete", (req, res) => {
    const {shelfId} = req.params
        
    if (!mongoose.Types.ObjectId.isValid(shelfId)) {
        res.status(400).json({ message: 'Specified shelf does not exist' });
        return;
    }
       
    PrivateShelf.findByIdAndRemove(shelfId)
    .then(() => res.json({ message: `Shelf was successfully removed.` }))
    .catch(err => res.json(err));

})
    



// RETURN SHELF DETAILS
router.post("/:shelf", (req, res) => {
    const {shelf} = req.params
    const {bookshelfId} = req.body

    if(shelf === "staticShelf") {
        return PrivateBookshelf.findById(bookshelfId)
        .then(bookshelf => res.json(bookshelf[shelf]))
        .catch(err => console.log(err))
    }

    else if (!mongoose.Types.ObjectId.isValid(shelf)) {return res.status(400).json({ message: 'Specified shelf does not exist' })}

    else {
        return PrivateShelf.findById(shelf)
        .populate("ebooks")
        .then(foundShelf => res.json(foundShelf.ebooks))
        .catch(err => console.log(err))
    }


});

module.exports = router;