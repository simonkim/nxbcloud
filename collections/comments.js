
Comments = new Meteor.Collection('comments');

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

    if (!post)
      throw new Meteor.Error(422, 'You must comment on a post');

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
