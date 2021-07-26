const router = require("express").Router();
const mongoose = require('mongoose');
const {PublicBookshelf} = require("../models/PublicBookshelf.model")
const {PublicShelf} = require("../models/PublicBookshelf.model")
const {PrivateBookshelf} = require("../models/PrivateBookshelf.model")
const {PrivateShelf} = require("../models/PrivateBookshelf.model")
const User = require('../models/User.model')



function whatShelf(shelf) {
    switch(shelf) {
        case "currentlyReading":
        case "wantToRead":
        case "read":
        case "staticShelf":
            return "static"
        case !mongoose.Types.ObjectId.isValid(shelf):
            return "not a shelf"
        default:
            return "dynamic"
    }
}

function publicPrivate(arg) {
    if(arg === "public") {return {bookShelf: PublicBookshelf, shelf: PublicShelf, books: books}}
    else {return {bookShelf: PrivateBookshelf, shelf: PrivateShelf, books: ebooks}}
}


function staticToStatic(par) {

    const {bookshelfId, shelfFrom, shelfTo, booksFrom, booksTo} = par

    return PublicBookshelf.findByIdAndUpdate(
        bookshelfId, 
        {
          [shelfFrom]: booksFrom, 
          [shelfTo]: booksTo
        }, 
        {new: true})
    .populate('dynamicShelves')
    .then(editedBookshelf => res.json(editedBookshelf))

}


function staticToDynamic(par, publicOrPrivate) {

    const {bookshelfId, shelfFrom, shelfTo, booksFrom, booksTo} = par
    const {bookShelf, shelf, books} = publicPrivate(publicOrPrivate)

    return bookShelf.findByIdAndUpdate(bookshelfId, {[shelfFrom]: booksFrom}, {new: true})
    .populate('dynamicShelves')
    .then(editedBookshelf => {
        shelf.findByIdAndUpdate(shelfTo, { [books]: booksTo}, {new: true})
        .then(editedShelf => res.json({editedBookshelf, editedShelf}))
    })
    .catch(err => console.log(err))

}


function dynamicToStatic(par, publicOrPrivate) {

    const {bookshelfId, shelfFrom, shelfTo, booksFrom, booksTo} = par
    const {bookShelf, shelf, books} = publicPrivate(publicOrPrivate)

    return shelf.findByIdAndUpdate(shelfFrom, { [books]: booksFrom}, {new: true})
    .then(editedShelf => {
        bookShelf.findByIdAndUpdate(bookshelfId, {[shelfTo]: booksTo}, {new: true})
        .populate('dynamicShelves')
        .then(editedBookshelf => res.json({editedBookshelf, editedShelf}))
    })
    .catch(err => console.log(err))

}


function dynamicToDynamic(par, publicOrPrivate) {

    const {shelfFrom, shelfTo, booksFrom, booksTo} = par
    const {shelf, books} = publicPrivate(publicOrPrivate)

    return shelf.findByIdAndUpdate(shelfFrom, { [books]: booksFrom}, {new: true})
    .then(editedShelfA => {
        shelf.findByIdAndUpdate(shelfTo, { [books]: booksTo}, {new: true})
        .populate('dynamicShelves')
        .then(editedShelfB => res.json({editedShelfA, editedShelfB}))
    })
    .catch(err => console.log(err))

}




module.exports = {
    whatShelf: whatShelf, 
    staticToStatic: staticToStatic,
    staticToDynamic: staticToDynamic,
    dynamicToStatic: dynamicToStatic,
    dynamicToDynamic: dynamicToDynamic
};
