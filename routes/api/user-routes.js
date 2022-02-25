const router = require('express').Router();
const res = require('express/lib/response');
const { User, Post, Vote } = require("../../models");

// GET /api/users
router.get('/', (req, res) => {
    //access our user model and run a .findAll() method
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
      attributes: { exclude: ['password'] },
      where: {
          id: req.params.id
      },
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'post_url', 'created_at']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'created_at']
        },
        {
          model: Post,
          attributes: ['title'],
          through: Vote,
          as: 'voted_posts'
        }
      ],
        
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user has this id number'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//this looks for a user in the user table when a user posts an updated password, it searches for their email to verify them
router.post('/login', (req, res) => {
  //expects email and password
  User.findOne({
    where: {
      email: req.body.email
    }

  }).then(dbUserData => {
    if(!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }

    //res.json({ user: dbUserData });

    //verify user
    const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password, try again.' });
      return;
    }
    res.json({ user: dbUserData, message: 'You are successfully logged in.' });
  });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    router.put('/:id', (req, res) => {
        // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
      
        // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
        User.update(req.body, {
          //add this for the hooks in the user.js
          individualHooks: true,
          where: {
            id: req.params.id
          }
        })
          .then(dbUserData => {
            if (!dbUserData[0]) {
              res.status(404).json({ message: 'No user found with this id' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
          id: req.params.id
        }
      })
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
});

module.exports = router;