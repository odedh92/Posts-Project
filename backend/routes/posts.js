const express = require('express')
const Post = require('../models/post')
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const postsController = require('../controllers/post');
const extractFile = require('../middleware/file');

router.post("", checkAuth,extractFile, postsController.createPost)

router.get('', postsController.getAllPosts);

router.get('/:id', postsController.getPost)

router.delete('/:id', checkAuth, postsController.deletePost);

router.put('/:id', checkAuth, extractFile, postsController.updatePost)

module.exports = router;
