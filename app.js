require('dotenv/config');
require('./config/db.config');


const express = require('express');
const app = express();
require('./config/index.config')(app);



// 👇 Start handling routes here
// Contrary to the views version, all routes are controlled from the routes/index.js
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const bookRoutes = require('./routes/book.routes');
app.use('/api/book', bookRoutes);

const bookshelfRoutes = require('./routes/bookshelf.routes');
app.use('/api/bookshelf', bookshelfRoutes);

const uploadRoutes = require('./routes/upload.routes');
app.use('/api/upload', uploadRoutes);


const indexRoutes = require('./routes/index.routes');
app.use('/api', indexRoutes);

app.use((req, res) => res.sendFile(__dirname + '/public/index.html'));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling/index.errors')(app);

module.exports = app;
