const bcrypt = require('bcrypt');
const express = require('express');
const uuidv1 = require('uuid/v1');
const bodyParser = require('body-parser')
const fs = require('fs')

const {checkForToken} = require('./middleware')
const PostService = require("../services/post");

const postApp = express.Router();

// MIDDLEWARE
app.use(bodyParser);
app.use(logger);

//  -------------------------PUBLIC ROUTES-------------------------
// GET POSTS
postApp.get('/:id', (req, res) => {
    const { id } = req.params;

    PostService.readUser(id)
        .then(post => {
            if (!post) {
                throw new Error('User not found!');
            }

            res.json(post);
        })
        .catch(err => {
            res.status(404).json({ error: err.toString() })
        });

});


//  -------------------------PRIVATE ROUTES-------------------------

// MiddleWare
postApp.use(tokenChecker)

// CREATE POST
postApp.post('/new-post', (req, res) => {
    const { post, updatedAt } = req.body;

    fsWPromise(post, updatedAt)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            res.status(400).json({ error: 'Something went wrong' });
        })
});


// UPDATE POST
postApp.put('/:id', (req, res) => {
    const { post, updatedAt } = req.body;

    PostService.updatePost(post, updatedAt)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            res.status(400).json({ error: 'Something went wrong' });
        })

})


// DELETE POST
postApp.delete('/:id', (req, res) => {
    const { id } = req.params;

    UserService.deleteUser(id)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            res.status(400).json({ error: err.toString() })
        })

})


module.exports = {
    postApp: app,
}
