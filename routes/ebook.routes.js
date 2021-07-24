const router = require("express").Router();
const mongoose = require('mongoose');
const Ebook = require("../models/Ebook.model");


//Ebook
router.get("/", (req, res, next) => {
  res.json("Ebook main - All good in here");
});


//CREATE Ebook
router.get("/create", (req, res, next) => {
  res.json("this is my createEbook page. ")
})


router.post("/create", (req, res, next) => {
  const { title, author, coverUrl, epubUrl} = req.body

  Ebook.create({
      title,
      author,
      coverUrl, 
      epubUrl
  })
  .then(createdEbook => res.json(createdEbook))
  .catch(err=>res.json(err))
});





//DISPLAY ONE Ebook
router.get("/:ebookId", (req, res, next) => {
  const id = req.params.ebookId


  Ebook.findById(id)
  .then(EbookResult => res.json(EbookResult))
  .catch(err => res.json(err))

})



//EDIT Ebook PAGE
router.get("/:ebookId/edit", (req, res, next) => {
  res.json("this is my editEbook page. ")
})


router.put("/:ebookId/edit", (req, res, next) => {
  const { ebookId
 } = req.params;
  const { title, author, coverUrl, epubUrl } = req.body

  if (!mongoose.Types.ObjectId.isValid(ebookId
  )) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
 
  Ebook.findByIdAndUpdate(ebookId
  , { title, author, coverUrl, epubUrl }, {new: true})
    .then((editedEbook) => res.json(editedEbook))
    .catch(error => res.json(error));

})





//DELETE Ebook
router.delete("/:ebookId", (req, res, next) => {
  const { ebookId
 } = req.params;
  if (!mongoose.Types.ObjectId.isValid(ebookId
  )) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
 
  Ebook.findByIdAndRemove(ebookId
  )
    .then(() => res.json({ message: `Ebook with ${ebookId
  } is removed successfully.` }))
    .catch(error => res.json(error));

})




//TESTING
router.get("/test/:ebookId", (req, res, next) => {
  res.json(req.params.ebookId
  );
});




module.exports = router;