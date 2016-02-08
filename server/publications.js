
/* Max number of rows per request */
var POSTS_LIMIT_DEFAULT = 50;
var POSTS_LIMIT_UNLIMITED = -1;

Meteor.publish('posts', function(options) {
    /* limit to the max rows */
    if ( options && options['limit'] === POSTS_LIMIT_UNLIMITED ) {
        AppConfig.debugEnabled() && console.log('publish: limiting max posts from ' + options['limit'] + ' to ' + POSTS_LIMIT_DEFAULT);
        options['limit'] = POSTS_LIMIT_DEFAULT;
    }
    return Posts.find({}, options);
});

Meteor.publish('singlePost', function(id) {
  return id && Posts.find(id);
});


Meteor.publish('comments', function(postId) {
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId});
});