const express = require('express');
const userRouter = express.Router();
const UserService = require('../services/users');
const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');
const bodyParser = require('body-parser');

const {checkForToken} = require('./middleware');


// MIDDLEWARE
app.use(bodyParser);
app.use(logger);

//  -------------------------PUBLIC ROUTES-------------------------

// GET ALL USERS : ADMIN
app.get('/all', (req, res) => {
    UserService.allUsers()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(404).json({ error: err.toString() })
        });
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    UserService.readUser(username)
        .then(user => {

            if (!user) {
                throw new Error(`Username ${username} does not exist.`)
            }

            return { match: bcrypt.compare(password, user.password), user: user }
        })
        .then(result => {
            if (!result.match) throw new Error(`The password didn't match.`)

            const token = uuidv1();
            const newUser = result.user;
            newUser.token = token;

            UserService.updateUser(username, newUser);

            res.json({
                status: 'Successful',
                token: token
            });
        })
        .catch(err => {
            res.status(400).json({ error: err.toString() })
        })
});

// GET USER
app.get('/:id', (req, res) => {
    const { id } = req.params;

    UserService.readUser(id)
        .then(user => {
            if (!user) {
                throw new Error('User not found!');
            }

            res.json(user);
        })
        .catch(err => {
            res.status(404).json({ error: err.toString() })
        });

});


//  -------------------------PRIVATE ROUTES-------------------------

// MiddleWare
app.use(tokenChecker)

// CREATE USER
app.post('/', (req, res) => {
    const { username, email, location, password } = req.body;

    bcrypt.hash(password, 10)
        .then((encryptedPassword) => {
            const newUser = {
                username: username,
                password: encryptedPassword,
                email: email,
                location: location,
                updatedAt: new Date()
            }

            return UserService.createUser(username, newUser);
        })
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            res.status(400).json({ error: 'Something went wrong' });
        })
});


// UPDATE USER
app.put('/:id', (req, res) => {
    const { username, email, location, password } = req.body;

    const newUser = {
        username: username,
        password: password,
        email: email,
        location: location,
        updatedAt: new Date()
    }

    UserService.updateUser(username, newUser)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            res.status(400).json({ error: 'Something went wrong' });
        })

})


// DELETE USER
app.delete('/:id', (req, res) => {
    const { id } = req.params;

    UserService.deleteUser(id)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            res.status(400).json({ error: err.toString() })
        })

})

module.exports = userRouter;