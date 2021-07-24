const router = require("express").Router();
const mongoose = require('mongoose');
const Review = require('../models/Review.model')


//ADD REVIEW
router.post('/:bookId/new-review', (req, res) => {
    const {bookId} = req.params
    const {owner, comment} = req.body
  
    Review.create({owner, comment, bookId})
    .then(newReview => res.json(newReview))
    .catch(err => res.json(err))
})
  
  

//LIST BOOK REVIEWS
router.get('/:bookId/reviews', (req, res) => {
      
    Review.find({"bookId": req.params.bookId})
    .then(reviews => res.json(reviews))
    .catch(err => res.json(err))
})


    module.exports = router;