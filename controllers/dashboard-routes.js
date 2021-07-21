const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        Post.findAll({
            where: {
                user_id: req.session.user_id
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
            attributes: ['id', 'post_title', 'post_content', 'created_at']
        })
            .then(dbPostData => {
                const posts = dbPostData.map(post => post.get({ plain: true }));
                res.render('dashboard', { posts, loggedIn: req.session.loggedIn });
            })
            .catch(err => {res.status(500).json(err)})
    } else {
        res.redirect('/login');
    }
});

router.get('/edit/:id', (req, res) => {
    if (req.session.loggedIn) {
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
                attributes: ['id', 'post_content', 'post_title', 'created_at']
            }
        )
            .then(dbPostData => {
                if (dbPostData) {
                    const post = dbPostData.get({ plain: true });

                    res.render('create-post', { post, loggedIn: req.session.loggedIn });
                } else {
                    res.status(500).json(err);
                }
            })
    } else {
        res.redirect('/login');
    }
});

module.exports = router;