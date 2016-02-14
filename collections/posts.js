Posts = new Meteor.Collection('posts');

Posts.allow({
  update: ownsDocument,
  remove: ownsDocument
});

Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    // may only edit the following two fields:
    var deny = (_.without(fieldNames, 'url', 'title', 'message').length > 0);

    if (!deny && Posts.findOne({title:modifier.$set.title})) {
      deny = true;
      console.log('deny.update(): new title:' + modifier.$set.title );
    }
    return deny;
  }
});

var logCollectionLinks = function(collectionId) {
    console.log('log: collectionId:' + collectionId);
    var comments = Comments.find({postId:collectionId}).fetch();
    for(var i = 0; i < comments.length; i++) {
      console.log(' comment[' + i + ']' + JSON.stringify(comments[i]));
    }
};

if ( Meteor.isServer ) {
Meteor.methods({
  post: function(postAttributes) {
    var user = Meteor.user();

    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to post new stories");

    // ensure the post has a title
    if (!postAttributes.title)
      throw new Meteor.Error(422, 'Please fill in a headline');


    // pick out the whitelisted keys
    var post = _.extend(_.pick(postAttributes, 'url', 'title', 'message'), {
      userId: user._id,
      author: user.username,
      submitted: new Date().getTime(),
      commentsCount: 0,
      upvoters: [], votes: 0
    });

    var postId = Posts.insert(post);

    return postId;
  },

  // Move links from collection to collection  
  moveLinks: function(srcCollectionId, dstCollectionId) {
    var user = Meteor.user();
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to perform this operation");

    var links = Comments.find({postId: srcCollectionId}).fetch();
    for( var i = 0; i < links.length; i++ ) {
      var link = Comments.findOne({postId: dstCollectionId, url:links[i].url});
      if ( !link ) {
        if ( AppConfig.debugEnabled() ) console.log('moveLinks: moving link:' + links[i].url);
        Comments.update({_id:links[i]._id}, {$set: {postId: dstCollectionId}}, function(error, count) {
          if ( !error ) {
            Posts.update(dstCollectionId, {$inc: {commentsCount: count}});
          }
        });
      } else {
        if ( AppConfig.debugEnabled() ) console.log('moveLinks: Discarding duplicate link:' + link.url);
      }
    }
  },

  deleteCollection: function(collectionId) {
      Comments.remove({postId:collectionId}, function(error, count) {
          console.log('deleteCollection: error:' + JSON.stringify(error) + ' count:' + count);
      });
      Posts.remove(collectionId);
  },

  /*
   * @param post with updated fields: title, url, message
   * @error 422 : title conflicts with existing collection
   *        401: not logged in 
   * 
   */
  updateCollection: function(postId, modifiedFields) {
    var result = { conflictCollectionId: null, updated: false};

    var user = Meteor.user();
    // ensure the user is logged in
    console.log('updateCollection:' + postId);

    if (!user)
      throw new Meteor.Error(401, "You need to login to upvote");

    var conflict = Posts.findOne({title:modifiedFields.title, _id: {$ne: postId}});
    if ( conflict ) {
      //throw new Meteor.Error(422, 
       // "Collection with title(" + modifiedFields.title +") already exists",
       // conflict._id
       // );
      console.log('updateCollection: title conflicts');
      result.conflictCollectionId = conflict._id;
    } else {
      console.log('updateCollection: updated');
      result.updated = true;
    }
    console.log('updateCollection: result:' + JSON.stringify(result));
    Posts.update({_id: postId}, {$set: modifiedFields});
    return result;
  },

  upvote: function(postId) {
    var user = Meteor.user();
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to upvote");

    Posts.update({
      _id: postId,
      upvoters: {$ne: user._id}
    }, {
      $addToSet: {upvoters: user._id},
      $inc: {votes: 1}
    });
  }
});
}