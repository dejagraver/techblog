const router = require('express').Router();
const { Comment, Post, User, Vote } = require('../../models');
const sequelize = require('../../config/connection');

router.get('/', (req, res) => {
  Post.findAll(
      {
          attributes: [
              'id',
              'post_title',
              'post_content',
              'created_at',
              [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
          ],
          order: [['created_at', 'DESC']],
          include: [
              {
                  model: Comment,
                  attributes: [
                      'id',
                      'comment_content',
                      'post_id',
                      'user_id',
                      'created_at',
                      [sequelize.literal('(SELECT COUNT(*) FROM vote, comment WHERE comment.id = vote.comment_id)'), 'vote_count']
                  ],
                  include: {
                      model: User,
                      attributes: ['username']
                  }
              },
              {
                  model: User,
                  attributes: ['username']
              }
          ]
      })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {res.status(500).json(err)});
});

//get post by id
  router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id', 
        'post_url', 
        'title', 
        'created_at',
        [
          sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
          'vote_count'
        ]
      ],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at'
            ],
            include: {
              model: User,
              attributes: ['username']
            }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {res.status(500).json(err)});
  });

//add post
router.post('/', (req, res) => {
  Post.create({
    title: req.body.title,
    body: req.body.body,
    user_id: req.session.user_id,
  })
    .then((dbPostData) => {res.json(dbPostData)})
    .catch((err) => {res.status(500).json(err)});
});

// update a post
router.put('/:id', (req, res) => {
  Post.update(
    {
      title: req.body.title
    },
    {
      where: {
        id: req.params.id
      }
    })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {res.status(500).json(err)});
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
    .catch((err) => {res.status(500).json(err)});
});
module.exports = router;