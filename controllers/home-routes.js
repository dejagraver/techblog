const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const sequelize = require('../config/connection');

router.get('/', (req, res) => {
    Post.findAll({
        include: [
            {
                model: Comment,
                include: {
                    model: User,
                    attributes: ['username']
                },
                attributes: ['id', 'comment_content', 'post_id', 'user_id', 'created_at']
            },
            {
                model: User,
                attributes: ['username']
            }
        ],
    })
        .then(dbPostData => {
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.render('home', {loggedIn: req.session.loggedIn, posts});
        })
        .catch(err => {res.status(500).json(err)})
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

router.get('/post/:id', (req, res) => {
    Post.findOne(
        {
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Comment,
                    include: {
                        model: User,
                        attributes: ['username']
                    },
                    attributes: ['id', 'comment_content', 'post_id', 'user_id', 'created_at']
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ],
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with that id.' });
                return;
            }
            const post = dbPostData.get({ plain: true });
            res.render('delete-comment', {post,loggedIn: req.session.loggedIn});
        })
        .catch(err => {res.status(500).json(err)})
})
module.exports = router;