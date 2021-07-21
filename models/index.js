// Import the models
const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');

//set up relationships
//many posts belong to a user 
User.hasMany(Post, {foreignKey: 'user_id',});
Post.belongsTo(User, {foreignKey: 'user_id',});

//many comments belong to a user
Comment.belongsTo(User, {foreignKey: 'user_id',});
Comment.belongsTo(Post, {foreignKey: 'post_id',});

//many comments belong to a post 
User.hasMany(Comment, {foreignKey: 'user_id',});
Post.hasMany(Comment, {foreignKey: 'post_id',});

module.exports = { User, Post, Comment };