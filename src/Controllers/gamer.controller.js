const Gamer = require('../Models/gamer.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
   const newGamer = new Gamer(req.body);
   newGamer.hashPassword = bcrypt.hashSync(req.body.password, 10);
   newGamer.save((err, gamer) => {
      if (err) {
         return res.status(400).send({
            message: err,
         });
      } else {
         gamer.hashPassword = undefined;
         return res.json(gamer);
      }
   });
};

exports.login = (req, res) => {
   Gamer.findOne(
      {
         username: req.body.username,
      },
      (err, gamer) => {
         if (err) throw err;
         if (
            !gamer ||
            !bcrypt.compareSync(req.body.password, gamer.hashPassword)
         ) {
            return res.status(401).json({
               message: 'Authentication Failed. Invalid User or Password!',
            });
         }
         return res.status(200).json({
            token: jwt.sign(
               {
                  username: gamer.username,
                  firstName: gamer.firstName,
               },
               'secret'
            ),
         });
      }
   );
};

// Create and Save a new Note
exports.create = (req, res) => {
   console.log(req.token);
   jwt.verify(req.token, 'secret', (err, authorizedData) => {
      if (err) {
         console.log(err);
         res.sendStatus(403);
      } else {
         res.status(200).json({
            message: 'SUCCESS: Connected to protected route',
            authorizedData,
         });
         console.log('SUCCESS: Connected to protected route');
      }
   });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    Gamer.find({}, (err, gamers) => {
      if (err) throw err;
      if (gamers) {
         console.log(gamers)
          res.status(200).send(gamers);
      }

   });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {};
