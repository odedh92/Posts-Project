const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors());

mongoose.connect("mongodb+srv://odedh92:asdfghjkl1@cluster0.8lksl6j.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Failed to connect to database');
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join("backend/images")))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PATCH,PUT, DELETE, OPTIONS');
  next();
})
app.use("/api/posts", postsRoutes)
app.use("/api/user", userRoutes)

module.exports = app;
