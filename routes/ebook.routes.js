const router = require("express").Router();
const mongoose = require('mongoose');
const {PrivateShelf, PrivateBookshelf} = require("../models/PrivateBookshelf.model")
const {PublicShelf} = require("../models/PublicBookshelf.model")
const Ebook = require("../models/Ebook.model");




// SHOW ALL EBOOKS

router.get('/', (req, res)=>{
  Ebook.find()
  .populate('owner')
  .then(allEbooks => res.json(allEbooks))
  .catch(err => res.json)  
})



//CREATE EBOOK ALL SHELVES
router.post("/create", (req, res) => {
  const { title, author, coverUrl, ebookUrl, owner} = req.body
  const bookshelfId = req.body.bookshelfId
  const shelf = req.body.shelf

  Ebook.create({
    title,
    author,
    coverUrl, 
    ebookUrl,
    owner,    
  })
  .then(createdEbook => {

     if(shelf === "static") {
      PrivateBookshelf.findByIdAndUpdate(bookshelfId, {$addToSet: {staticShelf: createdEbook._id}}, {new:true})
      .then(bookshelf => res.json(bookshelf))
      .catch(err => console.log(err))
    }

     else{
      PrivateShelf.findByIdAndUpdate(shelf, {$addToSet: {ebooks: createdEbook._id}}, {new:true})
      .then(shelf => res.json(shelf))
      .catch(err => console.log(err))
    } 
   
  }).catch(err => console.log(err))

})




//GET ONE EBOOK BY ID

router.get("/:ebookId", (req, res) => {
  const {ebookId} = req.params


  Ebook.findById(ebookId)
  .populate('owner')
  .then(EbookResult => res.json(EbookResult))
  .catch(err => res.json(err))

})



//EDIT EBOOK
router.get("/:ebookId/edit", (req, res) => {
  res.json("this is my editEbook page. ")
})


router.put("/:ebookId/edit", (req, res) => {
  const { ebookId} = req.params;
  const { title, author, coverUrl, ebookUrl, owner } = req.body

  if (!mongoose.Types.ObjectId.isValid(ebookId)) {
    res.status(400).json({ message: 'Specified Ebook does not exist' });
    return;
  }
 
  Ebook.findByIdAndUpdate(ebookId, { title, author, coverUrl, ebookUrl, owner }, {new: true})
    .then(editedEbook => res.json(editedEbook))
    .catch(err => res.json(err));

})



//DELETE Ebook
router.delete("/:ebookId/delete", (req, res) => {
  const {ebookId} = req.params
  if (!mongoose.Types.ObjectId.isValid(ebookId)) {
    res.status(400).json({ message: 'Specified Ebook does not exist' });
    return;
  }
 
  Ebook.findByIdAndRemove(ebookId)
    .then(() => res.json({ message: `Ebook was successfully removed.` }))
    .catch(err => res.json(err));

})



//TESTING
router.get("/test/:ebookId", (req, res) => {
  res.json(req.params.ebookId
  );
});




module.exports = router;
