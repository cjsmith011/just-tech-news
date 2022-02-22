const User = require('./User');
const Post = require('./Post')


//create associations, for this one: a user can have many posts and the fk helps associate them to each other
User.hasMany(Post, {
    foreignKey: 'user_id'
});
//create association, a post can only belong to one user
Post.belongsTo(User, {
    foreignKey: 'user_id',
});


module.exports = { User, Post };
