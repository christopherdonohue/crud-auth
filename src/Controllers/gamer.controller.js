const Gamer = require('../Models/gamer.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { privateKey } = JSON.parse(process.env.JWT_PRIVATE_KEY);
const { publicKey } = JSON.parse(process.env.JWT_PUBLIC_KEY);
require('dotenv').config();

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
      'username.value': req.body.username.value,
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
            id: gamer._id,
            username: gamer.username.value,
            firstName: gamer.firstName.value,
          },
          privateKey,
          { expiresIn: '1 hour', algorithm: 'RS256' }
        ),
      });
    }
  );
};

exports.create = (req, res) => {
  jwt.verify(
    req.token,
    publicKey,
    { algorithm: ['RS256'] },
    (err, authorizedData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        res.status(200).json({
          message: 'Permission Granted.',
          authorizedData,
        });
        Gamer.updateOne(
          { 'username.value': authorizedData.username },
          {
            $push: {
              posts: {
                userId: authorizedData.id,
                postId: req.body.datePosted,
                postBody: req.body.data,
                datePosted: req.body.datePosted,
              },
            },
          }
        )
          .then((res) => {
            return res;
          })
          .catch((err) => {
            return err;
          });
      }
    }
  );
};

exports.description = (req, res) => {
  jwt.verify(
    req.token,
    publicKey,
    { algorithm: ['RS256'] },
    (err, authorizedData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        res.status(200).json({
          message: 'Permission Granted.',
          authorizedData,
        });
        Gamer.updateOne(
          { _id: authorizedData.id },
          {
            $set: {
              description: req.body.data,
            },
          }
        )
          .then((res) => {
            return res;
          })
          .catch((err) => {
            return err;
          });
      }
    }
  );
};

exports.findAll = (req, res) => {
  Gamer.find({}, (err, gamers) => {
    if (err) throw err;
    if (gamers) {
      console.log(gamers);
      res.status(200).send(gamers);
    }
  });
};

exports.findOne = (req, res) => {
  jwt.verify(
    req.token,
    publicKey,
    { algorithm: ['RS256'] },
    (err, authorizedData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        Gamer.findById(authorizedData.id, (err, gamer) => {
          if (err) throw err;
          res.status(200).json({ gamer });
        });
      }
    }
  );
};

exports.uploadProfilePicture = (req, res) => {
  jwt.verify(
    req.token,
    publicKey,
    { algorithm: ['RS256'] },
    (err, authorizedData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        res.status(200).json({
          message: 'Permission Granted.',
          authorizedData,
        });
        Gamer.updateOne(
          { _id: authorizedData.id },
          {
            $set: {
              profilePicture: req.body.profilePicture,
            },
          }
        )
          .then((res) => {
            return res;
          })
          .catch((err) => {
            return err;
          });
      }
    }
  );
};

exports.update = (req, res) => {
  Gamer.findByIdAndUpdate(
    req.params.gamerId,
    { firstName: req.body.firstName, username: req.body.username },
    (err, gamer) => {
      if (err) throw err;
      res
        .status(200)
        .json({ msg: 'Update Successful', gamer: gamer.firstName });
    }
  );
};

exports.updatePost = (req, res) => {
  Gamer.updateOne(
    { 'posts.postId': req.body.postId },
    {
      $set: {
        'posts.$.postBody': req.body.newPost,
        'posts.$.datePosted': Date.now(),
      },
    },
    (err, gamer) => {
      if (err) throw err;
      res.status(200).json({ msg: 'Post Updated', posts: gamer.posts });
    }
  );
};

exports.deletePost = (req, res) => {
  Gamer.updateOne(
    { 'posts.postId': req.body.postId },
    {
      $pull: { posts: { postId: req.body.postId } },
    },
    (err, gamer) => {
      if (err) throw err;
      res.status(200).json({ msg: 'Post Deleted', posts: gamer.posts });
    }
  );
};

exports.changeColor = (req, res) => {
  if (req.body.type === 'firstName') {
    Gamer.findByIdAndUpdate(
      { _id: req.params.gamerId },
      { 'firstName.color': req.body.color },
      (err, gamer) => {
        if (err) throw err;
        res.status(200).json({ msg: 'Color Changed' });
      }
    );
  } else {
    Gamer.findByIdAndUpdate(
      { _id: req.params.gamerId },
      { 'username.color': req.body.color },
      (err, gamer) => {
        if (err) throw err;
        res.status(200).json({ msg: 'Color Changed' });
      }
    );
  }
};

exports.delete = (req, res) => {
  Gamer.findByIdAndDelete(req.params.gamerId, (err, gamer) => {
    if (err) throw err;
    res.status(200).json({ msg: 'Profile Deleted' });
  });
};
