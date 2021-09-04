var express = require('express');
var router = express.Router();
const app = express();
const user = require('./schema');
const jwt = require('jsonwebtoken');

// test api:-
router.get('/', function (req, res, next) {
  res.status(200).json({
    message: ` Namaste ! ${req.body.username} from server `
  });
});


// 1. Create-user: When the api is called, a user will be created. Take Username and Password. 

router.post('/signup', function (req, res, next) {

  user.findOne({ username: req.body.username })
    .exec((error, result) => {
      if (result) {
        res.status(400).json({
          message: 'User already registered'
        });
      } else {
        const { username, email, password } = req.body;

        const entry = new user({ username, email, password });

        entry.save((error, data) => {
          if (error) {
            res.status(400).json({ message: 'Something went wrong' });
          }
          if (data) {
            res.status(201).json({ result: data });
          }
        });
      }
    });

});

//2. login-user: Username and password will be sent to the API. API will return a JWT token.

router.post('/signin', function (req, res, next) {

  user.findOne({ email: req.body.email, password: req.body.password })
    .exec((error, result) => {

      if (error) {
        // console.log(error);`
        res.status(400).json({ error });
      }
      else {
        // console.log(result);`
        if (result != null) {
          const token = jwt.sign({ _email: user._email, _password: user._password }, 'secret',
            { expiresIn: '1h' })
          res.status(201).json({ result, token });
        }
        else {
          res.status(400).json('User Not found');
        }
      }
    });
});

//3. validate-user: Send token in the header > Authorization Header as a Bearer token. 

router.post('/userdetails', function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, 'secret');
  if (req.user = user) {
    let name = (req.body.email).split("@")[0].slice(0, 6)
    res.status(200).json({ user: `Welcome` + ' ' + name })
  }
});


// Edit or Rename user Api :. 

router.put('/:userId', function (req, res, next) {

  user.updateOne(
    { _id: req.params.userId },

    {
      $set: { username, password } = req.body,
    }
  )
    .then((result) => {
      res.status(200).json(result)
      console.log(result);
    }).catch((err) => { console.log(err) })

});

// Delete User Api :- 

router.delete('/:userId', function (req, res, next) {

  user.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({ user: 'deleted Successfully' })
    })

    .catch(err => {
      console.log("error");
      res.status(500).json({ error: err });
    });

});


module.exports = router;




