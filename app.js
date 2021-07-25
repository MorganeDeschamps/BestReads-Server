require('dotenv/config');
require('./config/db.config');


const express = require('express');
const app = express();
require('./config/index.config')(app);



// 👇 Start handling routes here
// Contrary to the views version, all routes are controlled from the routes/index.js
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const reviewRoutes = require('./routes/reviews.routes');
app.use('/api/review', reviewRoutes);

const ebookRoutes = require('./routes/ebook.routes');
app.use('/api/ebook', ebookRoutes);



//PUBLIC BOOKSHELF/SHELVES
const publicBookshelfRoutes = require('./routes/publicBookshelf.routes');
app.use('/api/public-bookshelf', publicBookshelfRoutes);

const publicShelvesRoutes = require('./routes/publicShelves.routes');
app.use('/api/public-shelves', publicShelvesRoutes)


//PRIVATE BOOKSHELF/SHELVES 
const privateBookshelfRoutes = require('./routes/privateBookshelf.routes');
app.use('/api/private-bookshelf', privateBookshelfRoutes);

const privateShelvesRoutes = require('./routes/privateShelves.routes');
app.use('/api/private-shelves', privateShelvesRoutes)



const indexRoutes = require('./routes/index.routes');
app.use('/api', indexRoutes);

app.use((req, res) => res.sendFile(__dirname + '/public/index.html'));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling/index.errors')(app);

module.exports = app;
