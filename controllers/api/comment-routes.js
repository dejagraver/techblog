const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

//get comments: display comments and posts 
router.get('/', (req, res) => {
  Comment.findAll({
    include: [
      {
        model: User,
        attributes: ['username'],
      },
      {
        model: Post,
        attributes: ['title'],
      }
    ],
  }) 
    .then((dbCommentData) => {res.json(dbCommentData);})
    .catch((err) => {res.status(500).json(err);});
});

//get comments by id: display the comments and posts
router.get('/:id', (req, res) => {
  Comment.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: User,
        attributes: ['username'],
      },
      {
        model: Post,
        attributes: ['title'],
      }
    ],
  }) 
    .then((dbCommentData) => {
      if (!dbCommentData) {
        res.status(404).json({ message: 'No Comment found in the database for this id' });
        return;
      }
      res.json(dbCommentData);
    })
    .catch((err) => {res.status(500).json(err);});
});

//add comment
router.post('/', (req, res) => {
  Comment.create({
    comment_text: req.body.comment_text,
    user_id: req.session.user_id,
    post_id: req.body.post_id,
  })
    .then((dbCommentData) => {res.json(dbCommentData);})
    .catch((err) => {res.status(500).json(err);});
});


//remove comment
router.delete('/:id', (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbCommentData) => {
      if (!dbCommentData) {
        res.status(404).json({ message: 'No Comment found in the database for this id' });
        return;
      }
      res.json(dbCommentData);
    })
    .catch((err) => {res.status(500).json(err);});
});

module.exports = router;