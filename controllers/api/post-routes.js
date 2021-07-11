const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

//get all the posts
router.get('/', (req, res) => {
  Post.findAll({
    attributes: ["id", "title", "body", "user_id"],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'user_id'],
      },
    ],
  })
    .then((dbPostData) => {res.json(dbPostData);})
    .catch((err) => {res.status(500).json(err);});
});

//get post by id
router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'title', 'body', 'user_id'],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'user_id'],
      },
    ],
  }) 
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No Post found' });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {res.status(500).json(err);});
});

//add post
router.post('/', (req, res) => {
  Post.create({
    title: req.body.title,
    body: req.body.body,
    user_id: req.session.user_id,
  })
    .then((dbPostData) => {res.json(dbPostData);})
    .catch((err) => {res.status(500).json(err);});
});

//remove post
router.delete('/:id', (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No Post found' });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {res.status(500).json(err);});
});

module.exports = router;