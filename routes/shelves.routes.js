const router = require("express").Router();
const mongoose = require('mongoose');
const {PublicBookshelf} = require("../models/PublicBookshelf.model")
const {PublicShelf} = require("../models/PublicBookshelf.model")
const {PrivateBookshelf} = require("../models/PrivateBookshelf.model")
const {PrivateShelf} = require("../models/PrivateBookshelf.model")
const User = require('../models/User.model')



 // >>>>>>>>>>>>>>>>>>>>>>>>>>> PUBLIC SHELVES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


 // CREATE PUBLIC SHELF AND APPEND TO PUBLIC BOOKSHELF

router.get("/public/create", (req, res) => {
    res.json("this is my Create PublicShelf page.")
  });
  
  
  router.post("/public/create", (req, res) => {
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
  
  
  // EDIT PUBLIC SHELF
  
  router.get("/public/:shelfId/edit", (req, res) => {
    res.json("this is my Edit PublicShelf page. ")
  });
  
  
  router.put("/public/:shelfId/edit", (req, res) => {
    const { shelfId } = req.params;
    const {name, books} = req.body
  
    if (!mongoose.Types.ObjectId.isValid(shelfId)) {
      res.status(400).json({ message: 'Specified shelf does not exist' });
      return;
    }
  
    PublicShelf.findByIdAndUpdate(shelfId, {
      name,
      books, 
    }, {new: true})
    .populate('books')
    .then(editedShelf => res.json(editedShelf))
  });
  
  
  //DELETE PUBLIC SHELF
  
  router.delete("/public/:shelfId/delete", (req, res) => {
    const {shelfId} = req.params
    if (!mongoose.Types.ObjectId.isValid(shelfId)) {
      res.status(400).json({ message: 'Specified shelf does not exist' });
      return;
    }
   
    PublicShelf.findByIdAndRemove(shelfId)
      .then(() => res.json({ message: `Shelf was successfully removed.` }))
      .catch(err => res.json(err));
  
  })
  
  
  // >>>>>>>>>>>>>>>>>>>>>>>>>>> PRIVATE BOOKSHELVES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


  // CREATE PRIVATE SHELF AND APPEND TO PRIVATE BOOKSHELF

router.get("/private/create", (req, res) => {
    res.json("this is my Private createShelf page. ")
  });
  
  
  router.post("/private/create", (req, res) => {
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
  
  
  // EDIT PRIVATE SHELF
  
  router.get("/private/:shelfId/edit", (req, res) => {
    res.json("this is my Edit PrivateShelf page. ")
  });
  
  
  router.put("/private/:shelfId/edit", (req, res) => {
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
  
  router.delete("/private/:shelfId/delete", (req, res) => {
    const {shelfId} = req.params
    if (!mongoose.Types.ObjectId.isValid(shelfId)) {
      res.status(400).json({ message: 'Specified shelf does not exist' });
      return;
    }
   
    PrivateShelf.findByIdAndRemove(shelfId)
      .then(() => res.json({ message: `Shelf was successfully removed.` }))
      .catch(err => res.json(err));
  
  })

  module.exports = router;