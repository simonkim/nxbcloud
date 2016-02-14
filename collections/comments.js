
Comments = new Meteor.Collection('comments');

Comments.allow({
  update: function(userId, comment, fieldNames) {
    console.log( 'Comments.allow.update:' + comment._id);
    return Meteor.user() && Meteor.userId() == userId;
  },
  remove: function(userId, comment, fieldNames) {
    console.log( 'Comments.allow.remove:' + comment._id);
    return Meteor.user() && Meteor.userId() == userId;
  }
});

Comments.deny({
  update: function(userId, comment, fieldNames) {
    // may only edit the following 3 fields:
    console.log( 'Comments.deny.update:' + comment._id);
    var deny = false;
    deny = (_.without(fieldNames, 'label', 'url', 'body').length > 0);
    console.log( 'Comments.deny.update: fieldNames:' + fieldNames + ', deny:' + deny);
    return deny;
  },
  remove: function(userId, comment, fieldNames) {
    console.log( 'Comments.deny.remove:' + comment._id);
    Posts.update(comment.postId, {$inc: {commentsCount: -1}});
    return false;
  }
});

Meteor.methods({
  comment: function(commentAttributes) {
    var user = Meteor.user();
    var post = Posts.findOne(commentAttributes.postId);
    var link = Comments.find({postId:commentAttributes.postId, url:commentAttributes.url}).fetch();

    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to make comments");

    if (!commentAttributes.label)
      throw new Meteor.Error(422, 'Please enter label');
    if (!commentAttributes.url)
      throw new Meteor.Error(422, 'Please enter URL');

    if (!post) {
      console.log('comment: collection not found with id:' + commentAttributes.postId);
      console.log('comment: posts:' + JSON.stringify(Posts.find().fetch()));
      throw new Meteor.Error(422, 'You must comment on a post');
    }

    if (link.length > 0)
      throw new Meteor.Error(422, 'Duplicate url');

    comment = _.extend(_.pick(commentAttributes, 'postId', 'body', 'label', 'url'), {
      userId: user._id,
      author: user.username,
      submitted: new Date().getTime()
    });

    // update the post with the number of comments
    Posts.update(comment.postId, {$inc: {commentsCount: 1}});

    // create the comment, save the id
    comment._id = Comments.insert(comment);

    // now create a notification, informing the user that there's been a comment
    createCommentNotification(comment);

    return comment._id;
  }
});
